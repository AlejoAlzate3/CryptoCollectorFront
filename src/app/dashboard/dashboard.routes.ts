import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Iniciar Sesión | CryptoApp',
    },
    {
        path: 'signup',
        component: SignupComponent,
        title: 'Crear Cuenta | CryptoApp',
    },
];
