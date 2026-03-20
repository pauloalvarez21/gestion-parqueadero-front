import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment.development';

interface Ticket {
  id: number;
  codigo: string;
  horaEntrada: string;
  tipoTarifa: string;
  estado: string;
  vehiculo: {
    placa: string;
    tipo: string;
  };
  espacio: {
    codigo: string;
  };
  creadoPor: string;
  finalizadoPor: string;
  numeroFactura: string;
}

@Component({
  selector: 'app-active-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './active-tickets.html',
  styleUrl: './active-tickets.css',
})
export class ActiveTicketsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    console.log('Iniciando loadTickets...');
    this.isLoading = true;
    const url = `${environment.baseUrl}/parqueadero/tickets/activos`;
    console.log('Consultando URL:', url);
    this.http.get<Ticket[]>(url).subscribe({
      next: (data) => {
        console.log('Respuesta de tickets activos:', data);
        this.tickets = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.errorMessage = 'No se pudieron cargar los tickets activos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
