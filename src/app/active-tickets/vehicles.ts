import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

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

  vehicles: Vehiculo[] = [];
  isLoading = false;
  searchPlaca = '';

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.isLoading = true;
    let url = `${environment.baseUrl}/vehiculos`;
    if (this.searchPlaca) {
      url += `?placa=${this.searchPlaca}`;
    }

    this.http.get<Vehiculo[]>(url).subscribe({
      next: (data) => {
        this.vehicles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
        this.isLoading = false;
      },
    });
  }
}
