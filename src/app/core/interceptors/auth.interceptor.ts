import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor que agrega el token JWT a todas las peticiones HTTP
 * y maneja errores de autenticación
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Si existe un token, clonamos la petición y agregamos el header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejamos la petición y capturamos errores 401 (no autorizado)
  return next(req).pipe(
    catchError((error) => {
      // Si recibimos un 401, el token es inválido o expiró
      if (error.status === 401) {
        console.warn('Token inválido o expirado. Redirigiendo al login...');
        authService.logout();
        router.navigate(['/dashboard/login']);
      }
      return throwError(() => error);
    })
  );
};
