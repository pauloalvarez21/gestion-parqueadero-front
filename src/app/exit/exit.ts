import { Component, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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
  creadoPor: string;
  finalizadoPor: string;
  numeroFactura: string;
}

@Component({
  selector: 'app-exit-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit.html',
  styleUrl: './exit.css',
})
export class ExitRegistrationComponent implements AfterViewInit, OnInit {
  @ViewChild('ticketInput') ticketInput!: ElementRef<HTMLInputElement>;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  request: SalidaRequest = {
    codigoTicket: '',
    observaciones: ''
  };

  payment: PagoResponse | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.request.codigoTicket = code;
      // Si quieres que liquide automáticamente al entrar con el código:
      // this.registerExit();
    }
  }

  ngAfterViewInit() {
      this.focusInput();
  }

  focusInput() {
      setTimeout(() => {
          if (this.ticketInput && this.ticketInput.nativeElement) {
              this.ticketInput.nativeElement.focus();
          }
      }, 100);
  }

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
    const printArea = document.getElementById('printableReceipt');
    if (printArea) {
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (printWindow) {
        const content = printArea.outerHTML;
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Recibo de Pago</title>
              <meta charset="utf-8">
              <base href="${window.location.origin}/">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                body { 
                  background: white; 
                  padding: 0; 
                  margin: 0; 
                  font-family: monospace; 
                  display: flex;
                  justify-content: center;
                }
                #printableReceipt { 
                  display: block !important;
                  width: 80mm; 
                  margin: 0; 
                  padding: 5mm; 
                  color: black !important;
                  text-align: center;
                }
                .d-print-none { display: none !important; }
                hr { border-color: black !important; border-style: dashed !important; opacity: 1 !important; border-width: 1px 0 0 0 !important; }
                @media print {
                  @page { margin: 0; size: auto; }
                  body { visibility: visible; }
                }
              </style>
            </head>
            <body onload="setTimeout(function(){ window.print(); window.close(); }, 800)">
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
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
    this.request = { observaciones: '', codigoTicket: '', placa: '' };
    this.errorMessage = '';
    this.cdr.detectChanges();
    // Allow view to render the form again before focusing
    setTimeout(() => {
        this.focusInput();
    }, 50);
  }
}
