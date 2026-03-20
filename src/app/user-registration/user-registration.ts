import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

declare var bootstrap: any;

interface UsuarioDTO {
  id: number;
  username: string;
  role: string;
}

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.html',
  styleUrls: ['./user-registration.css'],
})
export class UserRegistrationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  roles: string[] = ['ADMIN', 'OPERADOR', 'USER'];
  users: UsuarioDTO[] = [];

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
  modalMessage = '';
  isError = false;
  pendingDeleteUser = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<UsuarioDTO[]>(`${environment.baseUrl}/usuarios`).subscribe({
      next: (data) => {
        console.log('Usuarios recibidos del backend:', data);
        // Normalizamos los roles para que coincidan con el select (quitando ROLE_ si existe)
        this.users = data.map((u) => ({
          ...u,
          role: u.role.replace('ROLE_', '').trim().toUpperCase(),
        }));
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        // Mostrar el error específico en la pantalla para saber qué pasa
        let msg = '';
        if (err.status === 403) {
          msg =
            'Acceso denegado (403). Verifica que tu usuario tenga rol ADMIN en la base de datos.';
        } else if (err.status === 404) {
          msg = 'Endpoint no encontrado (404). ¿Reiniciaste el backend?';
        } else {
          msg = `Error al cargar usuarios: ${err.status} - ${err.message}`;
        }
        this.showModal(msg, true);
        this.cdr.detectChanges();
      },
    });
  }

  private showModal(message: string, isError: boolean) {
    this.modalMessage = message;
    this.isError = isError;
    this.cdr.detectChanges();
    const modalElement = document.getElementById('infoModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  changeRole(username: string, newRole: string) {
    this.http.put(`${environment.baseUrl}/usuarios/${username}/rol`, { newRole }).subscribe({
      next: () => {
        this.showModal(`Rol de ${username} actualizado a ${newRole}`, false);
        this.loadUsers(); // Recargar la lista para reflejar cambios
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showModal(err.error?.message || 'Error al actualizar el rol.', true);
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;

      // Extraemos los datos del formulario que la API necesita
      const { username, password, role } = this.registrationForm.value;
      const request = { username, password, role };

      this.http.post(`${environment.baseUrl}/auth/register`, request).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.showModal('Usuario creado exitosamente.', false);
          this.registrationForm.reset({ role: 'USER' });
          this.loadUsers(); // Recargar la lista
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.showModal(
            err.error?.message || 'Error al crear el usuario. Es posible que el nombre ya exista.',
            true,
          );
          console.error('Error en registro:', err);
          this.cdr.detectChanges();
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

  askDeleteUser() {
    const username = this.usernameInput.nativeElement.value;
    if (!username) return;

    this.pendingDeleteUser = username;
    const modalElement = document.getElementById('confirmModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmDelete() {
    if (this.pendingDeleteUser) {
      this.isDeleting = true;
      this.http.delete(`${environment.baseUrl}/usuarios/${this.pendingDeleteUser}`).subscribe({
        next: () => {
          this.isDeleting = false;
          this.showModal(`Usuario "${this.pendingDeleteUser}" eliminado exitosamente.`, false);
          this.usernameInput.nativeElement.value = ''; // Limpiar el campo de texto
          this.pendingDeleteUser = '';
          this.loadUsers(); // Recargar la lista
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Error eliminando usuario:', err);
          let msg = '';
          if (err.status === 404) {
            msg = 'Usuario no encontrado.';
          } else {
            msg = err.error?.message || 'Error al eliminar el usuario.';
          }
          this.showModal(msg, true);
          this.cdr.detectChanges();
        },
      });
    }
  }
}
