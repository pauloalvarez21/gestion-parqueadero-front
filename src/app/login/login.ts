import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const credentials = this.loginForm.value;

      this.http.post<any>('http://localhost:8082/api/auth/login', credentials)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.token) {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/home']); // Redirige al home tras el login
            }
          },
          error: (error) => {
            this.isLoading = false;
            // 1. Extraer el mensaje del backend (ej: "Usuario o contraseña incorrectos")
            this.errorMessage = error.error?.message || 'Ocurrió un error inesperado';
            console.error('Error de login:', error);

            // 2. Limpiar los inputs y el botón (reseteando el formulario)
            this.loginForm.reset();

            // 3. Mostrar el popup (Modal de Bootstrap)
            const modalElement = document.getElementById('errorModal');
            if (modalElement) {
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
            }
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}