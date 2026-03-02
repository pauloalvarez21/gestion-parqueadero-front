import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.html',
  styleUrls: ['./user-registration.css']
})
export class UserRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  // Formulario con validación de contraseña coincidente
  registrationForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Extraemos solo lo que la API necesita (AuthRequest)
      const { username, password } = this.registrationForm.value;
      const request = { username, password };

      this.http.post(`${environment.baseUrl}/auth/register`, request)
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.successMessage = 'Usuario creado exitosamente.';
            this.registrationForm.reset();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Error al crear el usuario. Es posible que el nombre ya exista.';
            console.error('Error en registro:', err);
          }
        });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
}
