import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../core/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user = signal<UserResponse | null>(null);
  isAuthenticated = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si está autenticado
    this.isAuthenticated.set(this.authService.isAuthenticated());
    
    // Obtener datos del usuario
    const userData = this.authService.getUser();
    if (userData) {
      this.user.set(userData);
    }

    // Suscribirse a cambios de autenticación
    this.authService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated.set(authenticated);
      if (authenticated) {
        this.user.set(this.authService.getUser());
      } else {
        this.user.set(null);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/dashboard/login']);
  }

  getUserInitials(): string {
    const user = this.user();
    if (!user) return '';
    
    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  getUserFullName(): string {
    const user = this.user();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }
}
