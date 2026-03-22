import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

// Interfaz basada en HistorialDTO de openapi.yaml
interface HistorialDTO {
  id: number;
  placaVehiculo: string;
  codigoEspacio: string;
  horaEntrada: string;
  horaSalida: string;
  duracionMinutos: number;
  valorTotal: number;
  creadoPor: string;
  finalizadoPor: string;
  numeroFactura: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class HistoryComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  history: HistorialDTO[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<HistorialDTO[]>(`${environment.baseUrl}/parqueadero/historial`).subscribe({
      next: (data) => {
        this.history = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'No se pudo cargar el historial. Verifique la conexión y sus permisos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
