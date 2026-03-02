import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-entry-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entry-registration.html',
  styleUrls: ['./entry-registration.css']
})
export class EntryRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  // Formulario basado en EntradaRequest de tu API
  entryForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.minLength(3)]],
    tipoVehiculo: ['CARRO', [Validators.required]],
    tipoTarifa: ['POR_MINUTO', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';
  ticket: any = null; // Para almacenar el TicketDTO de respuesta

  // Opciones basadas en los enums de tu API
  vehicleTypes = ['CARRO', 'MOTO', 'BICICLETA'];
  tariffTypes = ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'];

  onSubmit() {
    if (this.entryForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.ticket = null;

      this.http.post(`${environment.baseUrl}/parqueadero/entrada`, this.entryForm.value)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.ticket = response; // Guardamos el ticket para mostrarlo
            // Reseteamos el formulario manteniendo valores por defecto útiles
            this.entryForm.reset({
              tipoVehiculo: 'CARRO',
              tipoTarifa: 'POR_MINUTO'
            });
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Error al registrar el ingreso del vehículo.';
            console.error('Error en registro:', err);
          }
        });
    } else {
      this.entryForm.markAllAsTouched();
    }
  }
}

