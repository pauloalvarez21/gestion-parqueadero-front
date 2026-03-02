import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

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
  styleUrls: ['./tariff-management.css']
})
export class TariffManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  tariffs: Tarifa[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Formulario para crear o editar
  tariffForm: FormGroup = this.fb.group({
    id: [null], // Usado para saber si es edición
    tipoTarifa: ['POR_MINUTO', [Validators.required]],
    valor: ['', [Validators.required, Validators.min(0)]]
  });

  // Opciones basadas en tu API
  tariffTypes = ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'];

  ngOnInit() {
    this.loadTariffs();
  }

  loadTariffs() {
    this.isLoading = true;
    this.http.get<Tarifa[]>(`${environment.baseUrl}/tarifas`)
      .subscribe({
        next: (data) => {
          this.tariffs = data || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar las tarifas.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  onSubmit() {
    if (this.tariffForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.http.post(`${environment.baseUrl}/tarifas`, this.tariffForm.value)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = 'Tarifa guardada exitosamente.';
            this.loadTariffs(); // Recargar la lista
            this.resetForm();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Error al guardar la tarifa.';
            console.error(err);
          }
        });
    } else {
      this.tariffForm.markAllAsTouched();
    }
  }

  editTariff(tariff: Tarifa) {
    this.tariffForm.patchValue(tariff);
    this.successMessage = '';
    this.errorMessage = '';
  }

  resetForm() {
    this.tariffForm.reset({ tipoTarifa: 'POR_MINUTO' });
    this.successMessage = '';
    this.errorMessage = '';
  }
}
