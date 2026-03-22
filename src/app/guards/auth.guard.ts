import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Guard que protege las rutas requiriendo autenticación.
 * Verifica si existe un token válido en localStorage.
 * Si no hay token, redirige al login.
 */
export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token.trim() !== '') {
    return true;
  }

  // No hay token, redirigir al login
  router.navigate(['/login']);
  return false;
};
