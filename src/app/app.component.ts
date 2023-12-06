import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule]
})
export class AppComponent {
  session = this.supabase.session
  constructor(
    private readonly supabase: SupabaseService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.supabase.authChanges((_, session) => { this.session = session; })
  }


  async signOut() {
    const res = await this.supabase.signOut();
    this.router.navigate(['/'])
  }
}
