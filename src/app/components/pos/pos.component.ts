import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  term = ''

  constructor(
    private readonly supabase: SupabaseService
  ) {
  }
  getArticles() {
    this.supabase.getArticles(this.term).then(res => console.log(res?.count, res?.data))
  }
}
