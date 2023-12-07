import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { Article } from '../../models/supabase.model';
import { AutocompleteArticlesComponent } from '../autocomplete-articles/autocomplete-articles.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [FormsModule, AutocompleteArticlesComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  // hacer un componente para cada linea de output (form)

  constructor(
    private readonly supabase: SupabaseService
  ) {
  }

  articleSelected(event: Article) {
    this.createOutput(event)
  }

  createOutput(article: Article) {
    console.log(article)
  }

  createSale() {

  }
}
