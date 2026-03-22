import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

declare var bootstrap: any;

interface Vehiculo {
  id?: number;
  placa: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  color?: string;
  nombrePropietario?: string;
  telefonoPropietario?: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css'],
})
export class VehiclesComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  vehicles: Vehiculo[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchPlaca = '';

  // Paginación
  currentPage = 1;
  pageSize = 10;

  get paginatedVehicles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.vehicles.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.vehicles.length / this.pageSize);
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  newVehicle: Vehiculo = {
    placa: '',
    tipo: 'CARRO',
  };

  onPlacaChange(placa: string) {
    this.newVehicle.placa = placa.toUpperCase();
    if (this.newVehicle.placa.length >= 6) {
      this.http
        .get<Vehiculo>(`${environment.baseUrl}/vehiculos/${this.newVehicle.placa}`)
        .subscribe({
          next: (vehiculo) => {
            if (vehiculo) {
              console.log('Vehículo existente encontrado:', vehiculo);
              this.newVehicle = { ...vehiculo };
              this.successMessage = 'Datos cargados de un vehículo existente.';
              setTimeout(() => (this.successMessage = ''), 3000);
              this.cdr.detectChanges();
            }
          },
          error: () => {
            // No hacer nada si no se encuentra (es un vehículo nuevo)
            console.log('Vehículo no encontrado, es un nuevo registro.');
          },
        });
    }
  }

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.errorMessage = '';
    this.currentPage = 1; // Resetear paginación al buscar
    console.log('Iniciando carga de vehículos...');
    this.isLoading = true;
    let url = `${environment.baseUrl}/vehiculos`;
    if (this.searchPlaca) {
      url += `?placa=${this.searchPlaca}`;
    }
    console.log('Consultando URL:', url);

    this.http.get<Vehiculo[]>(url).subscribe({
      next: (data) => {
        console.log('Vehículos encontrados:', data);
        this.vehicles = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
        this.errorMessage = 'No se pudieron cargar los vehículos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  editVehicle(vehicle: Vehiculo) {
    this.newVehicle = { ...vehicle };
  }

  addVehicle() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const obs = this.newVehicle.id
      ? this.http.put<Vehiculo>(
          `${environment.baseUrl}/vehiculos/${this.newVehicle.id}`,
          this.newVehicle
        )
      : this.http.post<Vehiculo>(`${environment.baseUrl}/vehiculos`, this.newVehicle);

    obs.subscribe({
      next: () => {
        this.isLoading = false;
        this.searchPlaca = '';
        this.loadVehicles(); // Recargar la lista
        // Resetear el formulario
        this.newVehicle = { placa: '', tipo: 'CARRO' };
        // Cerrar el modal
        const modalElement = document.getElementById('addVehicleModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
        this.successMessage = 'Vehículo guardado con éxito.';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al guardar el vehículo.';
        console.error('Error saving vehicle:', err);
        this.cdr.detectChanges();
      },
    });
  }
}
