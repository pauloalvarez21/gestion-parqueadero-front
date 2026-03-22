# Guía de Pruebas Unitarias

## Configuración

El proyecto utiliza **Jasmine** y **Karma** como framework de pruebas y test runner respectivamente.

### Archivos de Configuración

| Archivo | Descripción |
|---------|-------------|
| `karma.conf.js` | Configuración del servidor Karma |
| `src/test.ts` | Punto de entrada para las pruebas |
| `src/polyfills.ts` | Polyfills necesarios para tests |
| `tsconfig.spec.json` | Configuración de TypeScript para tests |

## Estructura de un Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponente } from './mi-componente';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // 1. Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      imports: [MiComponente],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // 2. Crear instancia del componente
    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // Trigger ngOnInit

    // 3. Manejar petición inicial si existe
    const req = httpMock.expectOne('url-esperada');
    req.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    // 4. Verificar que no haya peticiones pendientes
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Patrones Comunes

### 1. Pruebas de Servicios HTTP

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

### 2. Pruebas con Formularios Reactivos

```typescript
it('should mark form as invalid when empty', () => {
  expect(component.myForm.valid).toBeFalse();
});

it('should mark form as valid when filled', () => {
  component.myForm.patchValue({
    field1: 'value1',
    field2: 'value2',
  });
  expect(component.myForm.valid).toBeTrue();
});

it('should submit form successfully', () => {
  component.myForm.patchValue({ field: 'value' });
  component.onSubmit();
  
  const req = httpMock.expectOne(`${environment.baseUrl}/api/submit`);
  expect(req.request.method).toBe('POST');
  req.flush({ success: true });
  
  expect(component.successMessage).toBeDefined();
});
```

### 3. Pruebas con Router

```typescript
import { provideRouter } from '@angular/router';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MiComponente],
    providers: [provideRouter([])], // Router vacío para tests
  }).compileComponents();
});

it('should navigate on action', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = spyOn(router, 'navigate').and.stub();
  
  component.someAction();
  
  expect(navigateSpy).toHaveBeenCalledWith(['/target-route']);
});
```

### 4. Pruebas con localStorage

```typescript
afterEach(() => {
  localStorage.clear();
});

it('should save data to localStorage', () => {
  localStorage.setItem('key', 'value');
  
  expect(localStorage.getItem('key')).toBe('value');
});

it('should read role from localStorage', () => {
  localStorage.setItem('role', 'ADMIN');
  fixture.detectChanges();
  
  expect(component.userRole).toBe('ADMIN');
});
```

### 5. Pruebas con fakeAsync

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should handle async operation', fakeAsync(() => {
  component.loadData();
  
  const req = httpMock.expectOne('/api/data');
  req.flush([]);
  
  tick(); // Avanzar el tiempo virtual
  
  expect(component.data).toBeDefined();
}));

it('should handle timeout', fakeAsync(() => {
  component.startTimer();
  
  tick(3000); // Avanzar 3 segundos
  
  expect(component.timerFinished).toBeTrue();
}));
```

## Mejores Prácticas

### ✅ DO's

```typescript
// ✅ Usar beforeEach para configuración común
beforeEach(() => {
  fixture = TestBed.createComponent(MiComponente);
  component = fixture.componentInstance;
});

// ✅ Limpiar recursos en afterEach
afterEach(() => {
  httpMock.verify();
  localStorage.clear();
});

// ✅ Usar descriptores claros
it('should load data when component initializes', () => {
  // Test claro y descriptivo
});

// ✅ Mockear dependencias externas
providers: [
  provideHttpClient(),
  provideHttpClientTesting(),
]

// ✅ Probar casos de éxito y error
it('should handle success', () => { /* ... */ });
it('should handle error', () => { /* ... */ });
```

### ❌ DON'Ts

```typescript
// ❌ No usar setTimeout en tests
// MAL
setTimeout(() => {
  expect(component.data).toBeDefined();
}, 1000);

// BIEN - Usar fakeAsync
fakeAsync(() => {
  tick(1000);
  expect(component.data).toBeDefined();
});

// ❌ No hacer tests muy grandes
// MAL - Un test que hace todo
it('should do everything', () => {
  // 50 líneas de código...
});

// BIEN - Tests pequeños y específicos
it('should load data', () => { /* ... */ });
it('should validate form', () => { /* ... */ });
it('should navigate on success', () => { /* ... */ });

// ❌ No depender del estado de otros tests
// Cada test debe ser independiente
```

## Comandos Útiles

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar en modo vigilancia
npm run test -- --watch

# Ejecutar en Chrome (visible)
npm run test -- --browsers=Chrome

# Ejecutar pruebas específicas
npm run test -- --include='src/app/login/*.spec.ts'

# Ejecutar con reporte de cobertura
npm run test -- --code-coverage

# Abrir reporte de cobertura
start coverage/gestion-parqueadero-front/index.html
```

## Solución de Problemas Comunes

### 1. ExpressionChangedAfterItHasBeenCheckedError

```typescript
// Problema: El valor cambia después de la detección de cambios
// Solución: Usar detectChanges() después de cada operación
fixture.detectChanges();
component.someAction();
fixture.detectChanges(); // ← Importante!
```

### 2. Peticiones HTTP no manejadas

```typescript
// Error: Expected no open requests, found 1
// Solución: Manejar TODAS las peticiones en el test

it('should handle all requests', () => {
  component.loadData(); // Primera petición
  
  const req1 = httpMock.expectOne('/api/data');
  req1.flush([]);
  fixture.detectChanges();
  
  component.loadMore(); // Segunda petición
  
  const req2 = httpMock.expectOne('/api/more');
  req2.flush([]);
  fixture.detectChanges();
});
```

### 3. Navegación asíncrona

```typescript
// Problema: La navegación causa errores de rutas
// Solución: Usar spy y stub

it('should navigate on success', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = spyOn(router, 'navigate').and.stub();
  
  component.submit();
  
  expect(navigateSpy).toHaveBeenCalledWith(['/home']);
});
```

## Recursos Adicionales

- [Guía oficial de testing en Angular](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Angular Testing Cookbook](https://angular.io/guide/testing)
