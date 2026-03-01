import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-parking-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking-spaces.html',
  styleUrls: ['./parking-spaces.css']
})
export class ParkingSpacesComponent implements OnInit {
  private http = inject(HttpClient);
  
  spaces: any[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Modelo para el formulario de creación
  newSpace = {
    tipoVehiculo: 'CARRO',
    cantidad: 1,
    tarifaBase: 5000 // Valor por defecto ejemplo
  };

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Iniciando petición a /api/parqueadero/espacios...');

    this.http.get<any[]>('http://localhost:8082/api/parqueadero/espacios')
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del backend:', data);
          this.spaces = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar espacios:', err);
          this.errorMessage = 'Error de conexión: ' + (err.error?.message || err.message || 'No se pudo conectar con el servidor');
          this.isLoading = false;
        }
      });
  }

  createSpaces() {
    this.http.post('http://localhost:8082/api/parqueadero/espacios/agregar', this.newSpace)
      .subscribe({
        next: () => {
          this.loadSpaces();
          // Cerrar el modal manualmente
          const modalElement = document.getElementById('addSpaceModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }
        },
        error: (err) => console.error('Error creating spaces:', err)
      });
  }
}