import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

interface LoginResponse {
  token: string;
  role: string;
}

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const credentials = this.loginForm.value;

      console.log('Enviando solicitud de login a:', `${environment.baseUrl}/auth/login`);

      this.http.post<LoginResponse>(`${environment.baseUrl}/auth/login`, credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            // Usar el rol devuelto directamente por el API
            if (response.role) {
              localStorage.setItem('role', response.role.replace('ROLE_', '').trim().toUpperCase());
            } else {
              // Fallback: Decodificar el token para extraer el rol si no viene en la respuesta
              const role = this.getRoleFromToken(response.token);
              if (role) {
                localStorage.setItem('role', role);
              }
            }

            this.router.navigate(['/home']); // Redirige al home tras el login
          } else {
            this.errorMessage = 'Error: No se recibió el token de autenticación.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error de login:', error);

          // 1. Mejor manejo de errores para diagnóstico
          if (error.status === 0) {
            this.errorMessage =
              'Error de conexión. Verifique si el backend está corriendo y si CORS está habilitado.';
          } else if (error.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (error.status === 403) {
            this.errorMessage =
              'Error 403: Acceso denegado. Verifique la configuración de CORS o CSRF en el backend.';
          } else {
            this.errorMessage = error.error?.message || 'Ocurrió un error inesperado';
          }

          // 2. Limpiar solo la contraseña para no obligar a reescribir el usuario
          this.loginForm.get('password')?.reset();

          // 3. Mostrar el popup (Modal de Bootstrap)
          const modalElement = document.getElementById('errorModal');
          if (modalElement && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private getRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Intentar extraer el rol de varios campos posibles
      let role = payload.role || payload.roles || payload.authorities;

      // Si es un array, tomar el primer elemento
      if (Array.isArray(role)) {
        role = role[0];
      }

      // Si es un objeto con 'authority' (común en Spring Security), extraerlo
      if (typeof role === 'object' && role?.authority) {
        role = role.authority;
      }

      // Normalizar: asegurar que sea string, quitar prefijo ROLE_ si existe y convertir a mayúsculas
      return typeof role === 'string' ? role.replace('ROLE_', '').trim().toUpperCase() : null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
