import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege las rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  console.warn('Usuario no autenticado. Redirigiendo al login...');
  router.navigate(['/dashboard/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
