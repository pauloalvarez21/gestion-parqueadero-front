import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import JsBarcode from 'jsbarcode';

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
            
            // Abrir modal e imprimir el código de barras después de un breve delay
            setTimeout(() => {
                const element = document.getElementById('barcodeSVG');
                if (element && this.ticket.codigo) {
                    JsBarcode(element, this.ticket.codigo, {
                        format: "CODE128",
                        displayValue: true,
                        fontSize: 16,
                        margin: 10,
                        width: 2,
                        height: 50
                    });
                }
                const modalElement = document.getElementById('ticketModal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                    this.cdr.detectChanges();
                }
            }, 100);

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

  // Método opcional si el usuario cierra el modal y quiere volver a verlo desde el panel lateral
  openTicketModal() {
      setTimeout(() => {
          const element = document.getElementById('barcodeSVG');
          if (element && this.ticket && this.ticket.codigo) {
              JsBarcode(element, this.ticket.codigo, {
                  format: "CODE128",
                  displayValue: true,
                  fontSize: 16,
                  margin: 10,
                  width: 2,
                  height: 50
              });
          }
          const modalElement = document.getElementById('ticketModal');
          if (modalElement) {
              // Buscar primero si ya existe la instancia, si no, crearla
              const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modal.show();
              this.cdr.detectChanges();
          }
      }, 50);
  }

  printTicket() {
      const printArea = document.getElementById('printableTicket');
      if (printArea) {
          const printWindow = window.open('', '_blank', 'width=400,height=600');
          if (printWindow) {
              const content = printArea.outerHTML;
              printWindow.document.open();
              printWindow.document.write(`
                  <html>
                      <head>
                          <title>Impresión de Ticket</title>
                          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
                          <style>
                              body { 
                                background: white; 
                                padding: 0; 
                                margin: 0; 
                                font-family: monospace; 
                                display: flex;
                                justify-content: center;
                              }
                              #printableTicket { 
                                width: 80mm; 
                                margin: 0; 
                                padding: 5mm; 
                                color: black;
                                text-align: center;
                              }
                              .d-print-none { display: none !important; }
                              hr { border-color: black !important; opacity: 1 !important; }
                              @media print {
                                  @page { margin: 0; size: auto; }
                              }
                          </style>
                      </head>
                      <body onload="setTimeout(function(){ window.print(); window.close(); }, 500)">
                          ${content}
                      </body>
                  </html>
              `);
              printWindow.document.close();
          }
      }
  }
}
