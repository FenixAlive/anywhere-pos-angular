import { Component, ViewChild } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Article, Output, Purchase, Sale } from '../../models/supabase.model';
import { AutocompleteArticlesComponent } from '../autocomplete-articles/autocomplete-articles.component';
import { KeyValuePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegistyComponent } from '../registy/registy.component';
import { HelperService } from '../../services/helper.service';
type temp =  {[key: number] : {article: Article, form: FormGroup}};

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, AutocompleteArticlesComponent, RegistyComponent, MatDatepickerModule, MatNativeDateModule, KeyValuePipe],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  loading = false
  pos: Sale = {
    created_at: new Date(), 
    subtotal: 0,
    discount: 0,
    tax_1: 0,
    tax_2: 0,
    tax_3: 0,
    total: 0,
    client_id: undefined
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
    this.calculateTotals()
  }

  async onSubmit(): Promise<void> {
    
    try {
      this.loading = true
      const resSale = await this.supabase.postSale(this.pos)
      if (resSale?.error) throw resSale.error
      for(let articleId in this.articles){
        const {article, form} = this.articles[articleId]
        const output: Output = {
          description: form.controls?.['description']?.value,
          type:'sale',
          quantity: form.controls?.['quantity']?.value,
          price: form.controls?.['price']?.value,
          subtotal: form.controls?.['subtotal']?.value,
          discount: form.controls?.['discount_amount']?.value,
          tax_1: form.controls?.['tax_1']?.value,
          tax_2: form.controls?.['tax_2']?.value,
          tax_3: form.controls?.['tax_3']?.value,
          total: form.controls?.['total']?.value,
          article_id: article?.id,
          created_at: this.pos.created_at,
          sale_id: resSale.data ? (resSale.data as Sale).id : undefined
        }
        this.supabase.postOutput(output).then(res=>{
          if (res?.error) throw res.error
          this.supabase.updateInventory( -form.controls?.['quantity']?.value, article).then(invRes=>{
            if(invRes?.error) throw invRes.error
          })
          this.helper.successMessage('Sale sent correctly!')
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
      this.calculateTotals()
      this.articleAuto.setFocus()
    }
  }

  calculateTotals(){
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
      tax1 += isNaN(tempTax1) ? 0 : tempTax1*(tempSubtotal-tempDiscount)/100
      const tempTax2 = parseFloat(this.articles[article].form.controls?.['tax_2_percentage'].value) 
      tax2 += isNaN(tempTax2) ? 0 : tempTax2*(tempSubtotal-tempDiscount)/100
      const tempTax3 = parseFloat(this.articles[article].form.controls?.['tax_3_percentage'].value) 
      tax3 += isNaN(tempTax3) ? 0 : tempTax3*(tempSubtotal-tempDiscount)/100
      const tempTotal = parseFloat(this.articles[article].form.controls?.['total'].value) 
      total += isNaN(tempTotal) ? 0 : tempTotal
    }
    this.pos.subtotal =  Math.round((subtotal + Number.EPSILON) * 100) / 100
    this.pos.discount =  Math.round((discount + Number.EPSILON) * 100) / 100
    this.pos.tax_1 =  Math.round((tax1 + Number.EPSILON) * 100) / 100
    this.pos.tax_2 =  Math.round((tax2 + Number.EPSILON) * 100) / 100
    this.pos.tax_3 =  Math.round((tax3 + Number.EPSILON) * 100) / 100
    this.pos.total = Math.round((total + Number.EPSILON) * 100) / 100
  }

  articleSelected(event: Article) {
    if(Object.hasOwn(this.articles, event.id as PropertyKey) || !event.id){
      return
    }
    this.articles[event.id as number] = {article: event, form: new FormGroup({})}
  }

  deleteArticle(id: string){
    delete this.articles[parseInt(id)]
    this.calculateTotals()
  }
}
