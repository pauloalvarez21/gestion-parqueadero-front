import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

declare var bootstrap: any;

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
  private readonly cdr = inject(ChangeDetectorRef);

  // Formulario basado en EntradaRequest de tu API
  entryForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.minLength(3)]],
    tipoVehiculo: ['CARRO', [Validators.required]],
    tipoTarifa: ['POR_MINUTO', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';
  ticket: any = null; // Para almacenar el TicketDTO de respuesta
  vehicleDetails: any = null; // Para mostrar detalles del vehículo encontrado

  // Opciones basadas en los enums de tu API
  vehicleTypes = ['CARRO', 'MOTO', 'BICICLETA'];
  tariffTypes = ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'];

  lookupVehicleByPlaca() {
    const placa = this.entryForm.get('placa')?.value?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (placa && placa.length >= 6) {
      this.http.get<any>(`${environment.baseUrl}/vehiculos/${placa}`)
        .subscribe({
          next: (vehiculo) => {
            if (vehiculo) {
              console.log('Vehículo encontrado:', vehiculo);
              this.vehicleDetails = vehiculo;
              this.entryForm.patchValue({
                tipoVehiculo: vehiculo.tipo
              });
              this.cdr.detectChanges();
            }
          },
          error: () => {
             this.vehicleDetails = null;
             this.cdr.detectChanges();
          }
        });
    } else {
      this.vehicleDetails = null;
      this.cdr.detectChanges();
    }
  }

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
            this.entryForm.reset({
              tipoVehiculo: 'CARRO',
              tipoTarifa: 'POR_MINUTO'
            });
          },
          error: (err) => {
            this.isLoading = false;
            // Intentar obtener el mensaje de error de varias fuentes posibles
            this.errorMessage = err.error?.message || err.error || 'Error al registrar el ingreso del vehículo.';
            console.error('Error en registro:', err);
            
            // Forzar actualización inmediata de la UI para que el botón se desbloquee
            this.cdr.detectChanges();
            
            // Mostrar el modal de error
            setTimeout(() => {
              const modalElement = document.getElementById('errorModal');
              if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                this.cdr.detectChanges(); // Otra vez para estar seguros dentro del modal
              }
            }, 50);
          }
        });
    } else {
      this.entryForm.markAllAsTouched();
    }
  }
}
