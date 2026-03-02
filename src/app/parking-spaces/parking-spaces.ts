import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

declare var bootstrap: any;

@Component({
  selector: 'app-parking-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking-spaces.html',
  styleUrls: ['./parking-spaces.css'],
})
export class ParkingSpacesComponent implements OnInit {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  spaces: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Modelo para el formulario de creación
  newSpace = {
    tipoVehiculo: 'CARRO',
    cantidad: 1,
    tarifaBase: 5000, // Valor por defecto ejemplo
  };

  // Modelo para el formulario de eliminación
  deleteRequest = {
    tipoVehiculo: 'CARRO',
    cantidad: 1,
  };

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Iniciando petición a /api/parqueadero/espacios...');

    this.http.get<any[]>(`${environment.baseUrl}/parqueadero/espacios`).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.spaces = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar espacios:', err);
        this.errorMessage =
          'Error de conexión: ' +
          (err.error?.message || err.message || 'No se pudo conectar con el servidor');
        this.isLoading = false;
      },
    });
  }

  createSpaces() {
    this.http.post(`${environment.baseUrl}/parqueadero/espacios/agregar`, this.newSpace).subscribe({
      next: () => {
        this.loadSpaces();
        // Cerrar el modal manualmente
        const modalElement = document.getElementById('addSpaceModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      },
      error: (err) => console.error('Error creating spaces:', err),
    });
  }

  deleteSpaces() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: this.deleteRequest,
    };

    this.http.delete(`${environment.baseUrl}/parqueadero/espacios/eliminar`, options).subscribe({
      next: () => {
        this.loadSpaces();
        // Cerrar el modal manualmente
        const modalElement = document.getElementById('deleteSpaceModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al eliminar: ' + (err.error?.message || err.message);
        console.error('Error deleting spaces:', err);
      },
    });
  }
}
