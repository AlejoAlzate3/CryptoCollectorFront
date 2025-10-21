import { Routes } from '@angular/router';
import { LoginComponent } from './dashboard/login/login.component';
import { SignupComponent } from './dashboard/signup/signup.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    },
    {
        path: 'crypto',
        loadChildren: () =>
            import('./crypto/crypto.routes').then((m) => m.CRYPTO_ROUTES),
    },
    {
        path: '**',
        loadComponent: () =>
            import('./not-found/not-found.component').then((c) => c.NotFoundComponent),
    },
];