import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <section class="not-found">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta que intentas acceder no existe.</p>
      <button mat-raised-button color="primary" routerLink="/dashboard/login">Volver al inicio</button>
    </section>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
  `],
})
export class NotFoundComponent { }
