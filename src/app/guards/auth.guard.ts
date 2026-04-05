import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Guard que protege las rutas requiriendo autenticación.
 * Verifica si existe un token válido en localStorage y si no ha expirado.
 * Si no hay token o ya venció, redirige al login.
 */
export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token.trim() !== '') {
    try {
      // Decodificar el payload del JWT para verificar la expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (now >= payload.exp) {
          console.warn('Sesión expirada. Redirigiendo al login.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.navigate(['/login']);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error al validar el token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.navigate(['/login']);
      return false;
    }
  }

  // No hay token, redirigir al login
  router.navigate(['/login']);
  return false;
};
