import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment.development';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs);

export interface Estadisticas {
  vehiculosActivos: number;
  espaciosDisponibles: number;
  espaciosOcupados: number;
  ingresosHoy: number;
  ingresosMes: number;
  ticketsHoy: number;
  ticketsMes: number;
}

export interface Espacio {
  id: number;
  codigo: string;
  tipoVehiculo: string;
  ocupado: boolean;
}

export interface Historial {
  id: number;
  placaVehiculo: string;
  codigoEspacio: string;
  horaEntrada: string;
  horaSalida: string;
  valorTotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  stats: Estadisticas | null = null;
  spaces: Espacio[] = [];
  history: Historial[] = [];
  
  isLoading = false;
  errorMessage = '';
  today = new Date();

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Combinar llamadas a endpoints
    forkJoin({
      stats: this.http.get<Estadisticas>(`${environment.baseUrl}/parqueadero/estadisticas`),
      spaces: this.http.get<Espacio[]>(`${environment.baseUrl}/parqueadero/espacios`),
      history: this.http.get<Historial[]>(`${environment.baseUrl}/parqueadero/historial`)
    }).subscribe({
      next: (result) => {
        this.stats = result.stats;
        this.spaces = result.spaces;
        // Solo los 8 registros más recientes del historial
        this.history = result.history
          .sort((a, b) => new Date(b.horaEntrada).getTime() - new Date(a.horaEntrada).getTime())
          .slice(0, 8);
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.errorMessage = 'No se pudieron sincronizar los datos del parqueadero.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTotalSpaces(): number {
    if (!this.stats) return 0;
    return this.stats.espaciosOcupados + this.stats.espaciosDisponibles;
  }

  getOccupationPercentage(): number {
    if (!this.stats || this.getTotalSpaces() === 0) {
      return 0;
    }
    return (this.stats.espaciosOcupados / this.getTotalSpaces()) * 100;
  }
}
