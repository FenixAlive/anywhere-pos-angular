import { Routes } from '@angular/router';
import { PosComponent } from './components/pos/pos.component';
import { AuthComponent } from './components/auth/auth.component';
import { EntriesComponent } from './components/entries/entries.component';
import { authGuardGuard } from './auth-guard.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { OutputsComponent } from './components/outputs/outputs.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { TodoComponent } from './components/todo/todo.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';

export const routes: Routes = [

    { path: 'pos', component: PosComponent, canActivate: [authGuardGuard] },
    { path: 'auth', component: AuthComponent },
    { path: 'entry', component: EntriesComponent, canActivate: [authGuardGuard] },
    { path: 'purchase', component: PurchasesComponent, canActivate: [authGuardGuard] },
    { path: 'output', component: OutputsComponent, canActivate: [authGuardGuard] },
    { path: 'articles', component: ArticlesComponent, canActivate: [authGuardGuard] },
    { path: 'configuration', component: ConfigurationComponent, canActivate: [authGuardGuard] },
    { path: 'todo', component: TodoComponent },

    { path: '', component: WelcomeComponent },
    { path: '**', component: WelcomeComponent }
];
