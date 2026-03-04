import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

interface SalidaRequest {
  codigoTicket?: string;
  placa?: string;
  observaciones?: string;
}

interface PagoResponse {
  codigoTicket: string;
  horaEntrada: string;
  horaSalida: string;
  duracionHoras: number;
  duracionMinutos: number;
  valorBase: number;
  valorAdicional: number;
  descuento: number;
  valorTotal: number;
  mensaje: string;
}

@Component({
  selector: 'app-exit-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit.html',
  styleUrl: './exit.css',
})
export class ExitRegistrationComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  request: SalidaRequest = {
    observaciones: ''
  };

  payment: PagoResponse | null = null;
  isLoading = false;
  errorMessage = '';

  registerExit() {
    console.log('Intentando registrar salida...', this.request);
    // Validar que al menos uno de los campos esté lleno
    if (!this.request.codigoTicket && !this.request.placa) {
      this.errorMessage = 'Debe ingresar el Código del Ticket o la Placa.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.payment = null;

    this.http.post<PagoResponse>(`${environment.baseUrl}/parqueadero/salida`, this.request)
      .subscribe({
        next: (data) => {
          console.log('Salida exitosa, datos recibidos:', data);
          this.payment = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al registrar salida:', err);
          this.errorMessage = err.error?.message || 'Error al procesar la salida. Verifique los datos.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  printReceipt() {
    window.print();
  }

  sendEmail() {
    if (!this.payment) return;
    const subject = encodeURIComponent(`Recibo de Parqueadero - ${this.payment.codigoTicket}`);
    const body = encodeURIComponent(`
      Hola, aquí está tu recibo de parqueadero:

      Ticket: ${this.payment.codigoTicket}
      Total Pagado: $${this.payment.valorTotal}

      Entrada: ${new Date(this.payment.horaEntrada).toLocaleString()}
      Salida: ${new Date(this.payment.horaSalida).toLocaleString()}
      Duración: ${this.payment.duracionHoras}h ${this.payment.duracionMinutos}m

      ¡Gracias por su visita!
    `);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  sendWhatsApp() {
     if (!this.payment) return;
     const text = encodeURIComponent(`*Recibo Parqueadero*\nTicket: ${this.payment.codigoTicket}\nTotal: $${this.payment.valorTotal}\nGracias por su visita.`);
     window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  reset() {
    this.payment = null;
    this.request = { observaciones: '' };
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
}
