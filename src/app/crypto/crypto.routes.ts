import { Routes } from '@angular/router';
import { CryptoListComponent } from './crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './crypto-detail/crypto-detail.component';

export const CRYPTO_ROUTES: Routes = [
    {
        path: '',
        component: CryptoListComponent,
        title: 'Listado de Criptomonedas',
    },
    {
        path: ':id',
        component: CryptoDetailComponent,
        title: 'Detalle de Criptomoneda',
    },
];
