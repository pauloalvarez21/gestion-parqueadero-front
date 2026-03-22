import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

/**
 * Guard que protege las rutas según el rol del usuario.
 * Verifica si el rol del usuario está en la lista de roles permitidos.
 * 
 * Uso en rutas:
 * { path: '/admin', component: AdminComponent, canActivate: [roleGuard], data: { allowedRoles: ['ADMIN'] } }
 */
export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (!role) {
    // No hay rol, redirigir al login
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['allowedRoles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    // Si no hay roles especificados, permitir acceso (solo requiere autenticación)
    return true;
  }

  const currentRole = role.trim().toUpperCase();

  if (allowedRoles.includes(currentRole)) {
    return true;
  }

  // Rol no autorizado, redirigir al home
  router.navigate(['/home']);
  return false;
};
