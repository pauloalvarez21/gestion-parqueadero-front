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

  newVehicle: Vehiculo = {
    placa: '',
    tipo: 'CARRO',
  };

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.errorMessage = '';
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

  addVehicle() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post<Vehiculo>(`${environment.baseUrl}/vehiculos`, this.newVehicle).subscribe({
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
        this.successMessage = 'Vehículo registrado con éxito.';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al registrar el vehículo.';
        console.error('Error adding vehicle:', err);
        this.cdr.detectChanges();
      },
    });
  }
}
