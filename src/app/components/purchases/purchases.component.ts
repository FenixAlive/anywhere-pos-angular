import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Article, Entry, Purchase } from '../../models/supabase.model';
import { SupabaseService } from '../../services/supabase.service';
import { AutocompleteArticlesComponent } from '../autocomplete-articles/autocomplete-articles.component';
import { RegistyComponent } from '../registy/registy.component';
import { HelperService } from '../../services/helper.service';
import { KeyValuePipe } from '@angular/common';
type temp =  {[key: number] : {article: Article, form: FormGroup}};

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, AutocompleteArticlesComponent, RegistyComponent, MatDatepickerModule, 
    MatNativeDateModule, KeyValuePipe],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent {
  loading = false
  purchase: Purchase = {
    created_at: new Date(), 
    subtotal: 0,
    discount: 0,
    tax_1: 0,
    tax_2: 0,
    tax_3: 0,
    total: 0,
    supplier_id: undefined
  }
  articles: temp = {}
  @ViewChild('articleAuto') articleAuto!: AutocompleteArticlesComponent

  constructor(
    private readonly supabase: SupabaseService,
    private readonly helper: HelperService,
  ) {
  }

  registryChange(registry: FormGroup, article: string){
    this.articles[parseInt(article)].form = registry
    this.calculatePurchaseTotals()
  }

  async onSubmit(): Promise<void> {
    
    try {
      this.loading = true
      const resPurchase = await this.supabase.postPurchase(this.purchase)
      if (resPurchase?.error) throw resPurchase.error
      for(let articleId in this.articles){
        const {article, form} = this.articles[articleId]
        const entry: Entry = {
          description: form.controls?.['description']?.value,
          type:'purchase',
          quantity: form.controls?.['quantity']?.value,
          price: form.controls?.['price']?.value,
          subtotal: form.controls?.['subtotal']?.value,
          discount: form.controls?.['discount_amount']?.value,
          tax_1: form.controls?.['tax_1']?.value,
          tax_2: form.controls?.['tax_2']?.value,
          tax_3: form.controls?.['tax_3']?.value,
          total: form.controls?.['total']?.value,
          article_id: article?.id,
          created_at: this.purchase.created_at,
          purchase_id: resPurchase.data ? (resPurchase.data as Purchase).id : undefined
        }
        this.supabase.postEntry(entry).then(res=>{
          if (res?.error) throw res.error
          this.supabase.updateInventory( form.controls?.['quantity']?.value, article).then(invRes=>{
            if(invRes?.error) throw invRes.error
          })
          this.helper.successMessage('Purchase sent correctly!')
          this.supabase.getArticles()
        }) 
      }
    } catch (error) {
      if (error instanceof Error) {
        this.helper.ErrorMessage(error.message)
      }
    } finally {
      this.loading = false
      this.articles = {}
      this.calculatePurchaseTotals()
      this.articleAuto.setFocus()
    }
  }

  calculatePurchaseTotals(){
    let subtotal = 0
    let discount = 0
    let tax1 = 0
    let tax2 = 0
    let tax3 = 0
    let total = 0
    for(let article in this.articles){
      const tempSubtotal = parseFloat(this.articles[article].form.controls?.['subtotal'].value) 
      subtotal += isNaN(tempSubtotal) ? 0 : tempSubtotal
      const tempDiscount = parseFloat(this.articles[article].form.controls?.['discount_amount'].value) 
      discount += isNaN(tempDiscount) ? 0 : tempDiscount
      const tempTax1 = parseFloat(this.articles[article].form.controls?.['tax_1_percentage'].value) 
      tax1 += isNaN(tempTax1) ? 0 : tempTax1
      const tempTax2 = parseFloat(this.articles[article].form.controls?.['tax_2_percentage'].value) 
      tax2 += isNaN(tempTax2) ? 0 : tempTax2
      const tempTax3 = parseFloat(this.articles[article].form.controls?.['tax_3_percentage'].value) 
      tax3 += isNaN(tempTax3) ? 0 : tempTax3
      const tempTotal = parseFloat(this.articles[article].form.controls?.['total'].value) 
      total += isNaN(tempTotal) ? 0 : tempTotal
    }
    this.purchase.subtotal = subtotal
    this.purchase.discount = discount
    this.purchase.tax_1 = tax1
    this.purchase.tax_2 = tax2
    this.purchase.tax_3 = tax3
    this.purchase.total = total
  }

  articleSelected(event: Article) {
    if(Object.hasOwn(this.articles, event.id as PropertyKey) || !event.id){
      return
    }
    this.articles[event.id as number] = {article: event, form: new FormGroup({})}
  }

  deleteArticle(id: string){
    delete this.articles[parseInt(id)]
    this.calculatePurchaseTotals()
  }
}
