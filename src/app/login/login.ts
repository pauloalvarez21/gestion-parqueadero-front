import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

interface LoginResponse {
  token: string;
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
            this.errorMessage = 'Error de conexión. Verifique si el backend está corriendo y si CORS está habilitado.';
          } else if (error.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (error.status === 403) {
            this.errorMessage = 'Error 403: Acceso denegado. Verifique la configuración de CORS o CSRF en el backend.';
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
}
