import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class HistoryComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  allHistory: HistorialDTO[] = [];
  filteredHistory: HistorialDTO[] = [];
  
  isLoading = false;
  errorMessage = '';

  // Filtros
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1; // 1-12
  
  years: number[] = [];
  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];

  monthlyTotal: number = 0;

  ngOnInit() {
    this.generateYearList();
    this.loadHistory();
  }

  generateYearList() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  loadHistory() {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<HistorialDTO[]>(`${environment.baseUrl}/parqueadero/historial`).subscribe({
      next: (data) => {
        this.allHistory = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'No se pudo cargar el historial.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    this.filteredHistory = this.allHistory.filter(item => {
      const date = new Date(item.horaSalida);
      return date.getFullYear() === Number(this.selectedYear) && 
             (date.getMonth() + 1) === Number(this.selectedMonth);
    });

    this.calculateTotal();
  }

  calculateTotal() {
    this.monthlyTotal = this.filteredHistory.reduce((acc, curr) => acc + curr.valorTotal, 0);
  }
}
