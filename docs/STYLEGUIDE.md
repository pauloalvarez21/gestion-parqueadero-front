# Guía de Estilos y Mejores Prácticas

## Tabla de Contenidos

1. [TypeScript](#typescript)
2. [Componentes](#componentes)
3. [Templates](#templates)
4. [Estilos](#estilos)
5. [Servicios](#servicios)
6. [Pruebas](#pruebas)

---

## TypeScript

### 1.1 Tipado Explícito

✅ **CORRECTO**
```typescript
// Tipado explícito en propiedades
isLoading: boolean = false;
items: Item[] = [];
selectedId: number | null = null;

// Tipado en funciones
getUser(id: number): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/users/${id}`);
}
```

❌ **INCORRECTO**
```typescript
// Evitar 'any'
data: any; // ❌

// Preferir interfaces o tipos
interface Data {
  id: number;
  name: string;
}
data: Data; // ✅
```

### 1.2 Uso de `inject()`

✅ **CORRECTO**
```typescript
export class MiComponente {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
}
```

❌ **INCORRECTO**
```typescript
// Evitar inyección por constructor (legacy)
constructor(
  private http: HttpClient,
  private fb: FormBuilder
) {}
```

### 1.3 Manejo de Null/Undefined

✅ **CORRECTO**
```typescript
// Optional chaining
const name = user?.profile?.name;

// Nullish coalescing
const value = input ?? 'default';

// Non-null assertion (solo cuando estás seguro)
const element = document.getElementById('myId')!;
```

---

## Componentes

### 2.1 Estructura del Componente

✅ **CORRECTO**
```typescript
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-componente.html',
  styleUrls: ['./mi-componente.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiComponente implements OnInit, OnDestroy {
  // 1. Inyección de dependencias
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  
  // 2. Propiedades públicas
  isLoading = false;
  errorMessage = '';
  
  // 3. Propiedades privadas
  private _subscription = new Subscription();
  
  // 4. Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  
  // 5. Métodos públicos
  loadData(): void {
    // Implementación
  }
  
  // 6. Métodos privados
  private _helperMethod(): void {
    // Implementación
  }
}
```

### 2.2 Naming Conventions

✅ **CORRECTO**
```typescript
// Selector: kebab-case con prefijo 'app'
selector: 'app-parking-spaces'

// Clase: PascalCase
export class ParkingSpacesComponent

// Archivo: kebab-case
parking-spaces.component.ts
```

### 2.3 Señales (Signals)

✅ **CORRECTO**
```typescript
// Usar signals para estado reactivo
readonly title = signal('Mi Título');
readonly items = signal<Item[]>([]);

// Actualizar signals
this.title.set('Nuevo Título');
this.items.update(items => [...items, newItem]);

// Leer signals (en template)
// {{ title() }}
```

---

## Templates

### 3.1 Estructura HTML

✅ **CORRECTO**
```html
<!-- Usar clases semánticas -->
<div class="space-card">
  <div class="space-card__header">
    <h3 class="space-card__title">{{ space.codigo }}</h3>
  </div>
  <div class="space-card__body">
    <p class="space-card__status" [class.space-card__status--occupied]="space.ocupado">
      {{ space.estado }}
    </p>
  </div>
</div>
```

❌ **INCORRECTO**
```html
<!-- Evitar clases genéricas -->
<div class="container">
  <div class="row">
    <div class="col">
      <div>Texto</div>
    </div>
  </div>
</div>
```

### 3.2 Directivas Estructurales

✅ **CORRECTO**
```html
<!-- ngFor con trackBy -->
<tr *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</tr>

<!-- ngIf con else -->
<div *ngIf="isLoading; else content">
  <spinner></spinner>
</div>
<ng-template #content>
  <p>Contenido cargado</p>
</ng-template>

<!-- Async pipe para observables -->
<p *ngFor="let item of items$ | async">
  {{ item.name }}
</p>
```

### 3.3 Bindings

✅ **CORRECTO**
```html
<!-- Property binding -->
<button [disabled]="!isValid" (click)="onSubmit()">Enviar</button>

<!-- Two-way binding -->
<input [(ngModel)]="searchTerm" />

<!-- Class binding -->
<div [class.active]="isActive" [class.disabled]="isDisabled"></div>

<!-- Style binding -->
<div [style.width.px]="width"></div>
```

---

## Estilos

### 4.1 Metodología BEM

✅ **CORRECTO**
```css
/* Block */
.space-card { }

/* Element */
.space-card__title { }
.space-card__status { }

/* Modifier */
.space-card--occupied { }
.space-card__status--available { }
```

### 4.2 Variables CSS

✅ **CORRECTO**
```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}

.space-card {
  padding: var(--spacing-md);
  border-left: 4px solid var(--primary-color);
}
```

### 4.3 Selectores

✅ **CORRECTO**
```css
/* Específico pero no demasiado */
.space-card .space-card__title {
  font-size: 1.25rem;
}

/* Evitar selectores anidados profundos */
.container .row .col .card .card-body .title { } /* ❌ */
```

---

## Servicios

### 5.1 Estructura de Servicio

✅ **CORRECTO**
```typescript
@Injectable({ providedIn: 'root' })
export class ParqueaderoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  
  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.baseUrl}/parqueadero/espacios`);
  }
  
  getEspacioById(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.baseUrl}/parqueadero/espacios/${id}`);
  }
  
  createEspacio(data: CreateEspacioDto): Observable<Espacio> {
    return this.http.post<Espacio>(`${this.baseUrl}/parqueadero/espacios`, data);
  }
}
```

### 5.2 Manejo de Errores

✅ **CORRECTO**
```typescript
getData(): Observable<Data[]> {
  return this.http.get<Data[]>(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error fetching data:', error);
      
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
}
```

### 5.3 DTOs e Interfaces

✅ **CORRECTO**
```typescript
// Interface para respuesta
export interface Espacio {
  id: number;
  codigo: string;
  tipoVehiculoPermitido: string;
  estado: string;
  ocupado: boolean;
}

// DTO para creación
export interface CreateEspacioDto {
  tipoVehiculo: string;
  cantidad: number;
  tarifaBase: number;
}

// DTO para actualización
export interface UpdateEspacioDto {
  id: number;
  estado: string;
}
```

---

## Pruebas

### 6.1 Estructura de Test

✅ **CORRECTO**
```typescript
describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 6.2 Naming de Tests

✅ **CORRECTO**
```typescript
it('should create component', () => { });
it('should load data on init', () => { });
it('should handle error when loading data', () => { });
it('should navigate to detail on click', () => { });
it('should validate form before submit', () => { });
```

❌ **INCORRECTO**
```typescript
it('test 1', () => { }); // ❌ Muy genérico
it('should work', () => { }); // ❌ No describe qué
it('loading test', () => { }); // ❌ No es una afirmación
```

### 6.3 Mock de HTTP

✅ **CORRECTO**
```typescript
it('should load data successfully', () => {
  const mockData = [{ id: 1, name: 'Test' }];
  
  component.loadData();
  
  const req = httpMock.expectOne(`${environment.baseUrl}/api/data`);
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
  
  expect(component.data).toEqual(mockData);
  expect(component.isLoading).toBeFalse();
});

it('should handle error', () => {
  component.loadData();
  
  const req = httpMock.expectOne(`${environment.baseUrl}/api/data`);
  req.flush('Error', { status: 500, statusText: 'Server Error' });
  
  expect(component.errorMessage).toBeDefined();
  expect(component.isLoading).toBeFalse();
});
```

---

## Git y Commits

### 7.1 Convenciones de Commit

✅ **CORRECTO**
```bash
git commit -m "feat: agregar filtro por fecha en historial"
git commit -m "fix: corregir error de autenticación"
git commit -m "docs: actualizar README"
git commit -m "test: agregar pruebas de login"
git commit -m "refactor: optimizar carga de datos"
```

### 7.2 Ramas

✅ **CORRECTO**
```bash
git checkout -b feature/nueva-funcionalidad
git checkout -b fix/corregir-bug
git checkout -b docs/actualizar-documentacion
```

---

## Performance

### 8.1 Change Detection

✅ **CORRECTO**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiComponente { }
```

### 8.2 TrackBy en ngFor

✅ **CORRECTO**
```typescript
// En el componente
trackById(index: number, item: Item): number {
  return item.id;
}

// En el template
<tr *ngFor="let item of items; trackBy: trackById">
```

### 8.3 Lazy Loading

✅ **CORRECTO**
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent),
  },
];
```

---

## Seguridad

### 9.1 Sanitización

✅ **CORRECTO**
```typescript
// Usar DomSanitizer para HTML dinámico
constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(html);
}
```

### 9.2 Token Management

✅ **CORRECTO**
```typescript
// Interceptor para agregar token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }
  
  return next(req);
};
```

---

## Recursos Adicionales

- [Angular Style Guide](https://angular.dev/guide/styleguide)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [RxJS Best Practices](https://rxjs.dev/guide/best-practices)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
