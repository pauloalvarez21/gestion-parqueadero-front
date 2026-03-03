import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

// Definimos la interfaz basada en tu TarifaDTO
export interface Tarifa {
  id?: number;
  tipoTarifa: string;
  valor: number;
}

@Component({
  selector: 'app-tariff-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tariff-management.html',
  styleUrls: ['./tariff-management.css'],
})
export class TariffManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // Datos y estado tipados
  tariffs: Tarifa[] = [];
  tariffTypes = ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Formulario reactivo
  tariffForm: FormGroup = this.fb.group({
    id: [null],
    tipoTarifa: ['', Validators.required],
    valor: [null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    // Cargar tarifas al iniciar el componente
    this.loadTariffs();
  }

  loadTariffs() {
    this.isLoading = true;
    this.http.get<Tarifa[]>(`${environment.baseUrl}/tarifas`).subscribe({
      next: (data) => {
        this.tariffs = data;
        this.isLoading = false;
        console.log('Tarifas cargadas:', data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tarifas:', err);
        this.errorMessage = 'No se pudo conectar con el servidor para obtener las tarifas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit() {
    if (this.tariffForm.invalid) {
      this.tariffForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const tariffData = this.tariffForm.value;

    // El endpoint POST maneja tanto creación como actualización según tu API
    this.http.post<Tarifa>(`${environment.baseUrl}/tarifas`, tariffData).subscribe({
      next: (res) => {
        this.successMessage = 'Tarifa guardada exitosamente.';
        this.isLoading = false;
        this.loadTariffs(); // Recargar la tabla
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar tarifa:', err);
        this.errorMessage = 'Ocurrió un error al intentar guardar la tarifa.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  editTariff(tariff: Tarifa) {
    // Cargar datos en el formulario para edición
    this.tariffForm.patchValue(tariff);
    this.successMessage = '';
    this.errorMessage = '';
  }

  deleteTariff(tariff: Tarifa) {
    if (!tariff.tipoTarifa) return;
    if (confirm('¿Está seguro de que desea eliminar esta tarifa?')) {
      this.isLoading = true;
      this.http
        .delete(`${environment.baseUrl}/parqueadero/tarifas/${tariff.tipoTarifa}`)
        .subscribe({
          next: () => {
            this.successMessage = 'Tarifa eliminada correctamente.';
            this.loadTariffs();
          },
          error: (err) => {
            console.error('Error al eliminar tarifa:', err);
            if (err.status === 404) {
              this.errorMessage = 'La tarifa no fue encontrada. Puede que ya haya sido eliminada.';
            } else {
              this.errorMessage = 'No se pudo eliminar la tarifa.';
            }
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  resetForm() {
    this.tariffForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
