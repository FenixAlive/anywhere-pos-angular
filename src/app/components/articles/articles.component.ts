import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupabaseService } from '../../services/supabase.service';
import { Article } from '../../models/supabase.model';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {
  loading = false
  articlesForm!: FormGroup

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) { this.createArticleForm() }

  createArticleForm() {
    this.articlesForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      identifier_code: [null],
      description: [null],
      price_1: [0, [Validators.required]],
      price_2: [0],
      price_3: [0],
      discount_amount: [0],
      discount_percentage: [0],
      tax_1_percentage: [null],
      tax_2_percentage: [null],
      tax_3_percentage: [null],
    })
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const article = this.articlesForm.value as Article
      const review = ['price_2', 'price_3', 'discount_amount', 'discount_percentage']
      review.forEach((prop: string) => {
        if (!article?.[prop as keyof Article] && article?.[prop as keyof Article] !== 0) {
          delete article?.[prop as keyof Article]
        }
      })
      const res = await this.supabase.postArticle(article)
      if (res?.error) throw res.error
      alert('article sent correctly!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.createArticleForm()
      this.loading = false
    }
  }
}