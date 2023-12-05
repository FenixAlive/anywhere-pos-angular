import { Routes } from '@angular/router';
import { PosComponent } from './components/pos/pos.component';
import { AuthComponent } from './components/auth/auth.component';
import { EntriesComponent } from './components/entries/entries.component';
import { authGuardGuard } from './auth-guard.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { OutputsComponent } from './components/outputs/outputs.component';

export const routes: Routes = [
    { path: 'pos', component: PosComponent, canActivate: [authGuardGuard] },
    { path: 'auth', component: AuthComponent },
    { path: 'entries', component: EntriesComponent, canActivate: [authGuardGuard] },
    { path: 'outputs', component: OutputsComponent, canActivate: [authGuardGuard] },
    { path: 'articles', component: ArticlesComponent, canActivate: [authGuardGuard] },
    { path: '**', component: WelcomeComponent }
];
