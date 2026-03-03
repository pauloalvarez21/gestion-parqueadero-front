import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

// Interfaz basada en EstadisticasDTO
export interface Estadisticas {
  vehiculosActivos: number;
  espaciosDisponibles: number;
  espaciosOcupados: number;
  ingresosHoy: number;
  ingresosMes: number;
  ticketsHoy: number;
  ticketsMes: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class StatisticsComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  stats: Estadisticas | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<Estadisticas>(`${environment.baseUrl}/parqueadero/estadisticas`).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.errorMessage = 'No se pudieron cargar las estadísticas del parqueadero.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
