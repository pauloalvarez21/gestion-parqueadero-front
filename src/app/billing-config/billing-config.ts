import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

interface ResolucionFactura {
  numeroResolucion: string;
  fechaResolucion: string;
  prefijo: string;
  numeroDesde: number;
  numeroHasta: number;
  numeroActual: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  mensajePiePagina: string;
}

@Component({
  selector: 'app-billing-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './billing-config.html',
  styleUrls: ['./billing-config.css'],
})
export class BillingConfigComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  configForm: FormGroup;
  activeResolucion: ResolucionFactura | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.configForm = this.fb.group({
      numeroResolucion: ['', Validators.required],
      fechaResolucion: ['', Validators.required],
      prefijo: [''],
      numeroDesde: [1, [Validators.required, Validators.min(1)]],
      numeroHasta: [999999, [Validators.required, Validators.min(1)]],
      numeroActual: [0, [Validators.required, Validators.min(0)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      mensajePiePagina: [''],
    });
  }

  ngOnInit() {
    this.loadActiveResolucion();
  }

  loadActiveResolucion() {
    this.isLoading = true;
    this.http.get<ResolucionFactura>(`${environment.baseUrl}/parqueadero/facturacion/resolucion/activa`)
      .subscribe({
        next: (data) => {
          this.activeResolucion = data;
          if (data) {
            this.configForm.patchValue(data);
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar resolución activa:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    if (this.configForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post<ResolucionFactura>(`${environment.baseUrl}/parqueadero/facturacion/resolucion`, this.configForm.value)
      .subscribe({
        next: (data) => {
          this.activeResolucion = data;
          this.successMessage = 'Resolución configurada exitosamente.';
          this.isLoading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (err) => {
          console.error('Error al guardar resolución:', err);
          this.errorMessage = err.error?.message || 'Error al guardar la configuración.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
