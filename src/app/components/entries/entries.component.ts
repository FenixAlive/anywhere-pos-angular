import { Component, ViewChild} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Article, Entry } from '../../models/supabase.model';
import { SupabaseService } from '../../services/supabase.service';
import { AutocompleteArticlesComponent } from '../autocomplete-articles/autocomplete-articles.component';
import { RegistyComponent } from '../registy/registy.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HelperService } from '../../services/helper.service';
@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, AutocompleteArticlesComponent, RegistyComponent, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss'
})
export class EntriesComponent {
  loading = false
  formGroup!: FormGroup
  article!: Article
  created = new Date()
  @ViewChild('articleAuto') articleAuto!: AutocompleteArticlesComponent

  constructor(
    private readonly supabase: SupabaseService,
    private readonly helper: HelperService
  ) { }

  registryChange(registry: FormGroup){
    this.formGroup = registry;
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const entry: Entry = {
        description: this.formGroup.controls?.['description']?.value,
        type:'adjustment',
        quantity: this.formGroup.controls?.['quantity']?.value,
        price: this.formGroup.controls?.['price']?.value,
        subtotal: this.formGroup.controls?.['subtotal']?.value,
        discount: this.formGroup.controls?.['discount_amount']?.value,
        tax_1: this.formGroup.controls?.['tax_1']?.value,
        tax_2: this.formGroup.controls?.['tax_2']?.value,
        tax_3: this.formGroup.controls?.['tax_3']?.value,
        total: this.formGroup.controls?.['total']?.value,
        article_id: this.article?.id,
        created_at: this.created
      }

      const res = await this.supabase.postEntry(entry)
      if (res?.error) throw res.error
      const invRes = await this.supabase.updateInventory(this.formGroup.controls?.['quantity']?.value, this.article)
      if(invRes?.error) throw invRes.error
      this.helper.successMessage('Entry sent correctly!')
      await this.supabase.getArticles()
    } catch (error) {
      if (error instanceof Error) {
        this.helper.ErrorMessage(error.message)
      }
    } finally {
      this.loading = false
      this.article = {}
      this.articleAuto.setFocus()
    }
  }

  articleSelected(event: Article) {
    this.article = event
  }
}
