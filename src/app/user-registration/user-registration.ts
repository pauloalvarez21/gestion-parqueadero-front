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
  styleUrls: ['./user-registration.css'],
})
export class UserRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  roles: string[] = ['ADMIN', 'OPERADOR', 'USER'];

  // Formulario con validación de contraseña coincidente
  registrationForm: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['USER', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  isLoading = false;
  isDeleting = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Extraemos los datos del formulario que la API necesita
      const { username, password, role } = this.registrationForm.value;
      const request = { username, password, role };

      this.http.post(`${environment.baseUrl}/auth/register`, request).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Usuario creado exitosamente.';
          this.registrationForm.reset({ role: 'USER' });
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.message || 'Error al crear el usuario. Es posible que el nombre ya exista.';
          console.error('Error en registro:', err);
          setTimeout(() => (this.errorMessage = ''), 5000);
        },
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  deleteUser(usernameInput: HTMLInputElement) {
    const username = usernameInput.value;
    if (!username) return;

    if (confirm(`¿Está seguro de que desea eliminar el usuario "${username}"?`)) {
      this.isDeleting = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.http.delete(`${environment.baseUrl}/auth/eliminar/${username}`).subscribe({
        next: () => {
          this.isDeleting = false;
          this.successMessage = `Usuario "${username}" eliminado exitosamente.`;
          usernameInput.value = ''; // Limpiar el campo de texto
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Error eliminando usuario:', err);
          if (err.status === 404) {
            this.errorMessage = 'Usuario no encontrado.';
          } else {
            this.errorMessage = err.error?.message || 'Error al eliminar el usuario.';
          }
          setTimeout(() => (this.errorMessage = ''), 5000);
        },
      });
    }
  }
}
