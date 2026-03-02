import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-exit-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exit-registration.html',
  styleUrls: ['./exit-registration.css']
})
export class ExitRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  // Formulario basado en SalidaRequest
  exitForm: FormGroup = this.fb.group({
    codigoTicket: [''],
    placa: [''],
    observaciones: ['']
  }, { validators: this.atLeastOneValidator });

  isLoading = false;
  errorMessage = '';
  paymentInfo: any = null; // Almacena la respuesta PagoResponse

  onSubmit() {
    if (this.exitForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.paymentInfo = null;

      this.http.post(`${environment.baseUrl}/parqueadero/salida`, this.exitForm.value)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.paymentInfo = response;
            this.exitForm.reset();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Error al procesar la salida.';
            console.error('Error en salida:', err);
          }
        });
    } else {
      this.exitForm.markAllAsTouched();
    }
  }

  // Validador personalizado: Requiere Ticket O Placa
  private atLeastOneValidator(control: AbstractControl): ValidationErrors | null {
    const ticket = control.get('codigoTicket')?.value;
    const placa = control.get('placa')?.value;
    return (ticket || placa) ? null : { atLeastOneRequired: true };
  }
}
