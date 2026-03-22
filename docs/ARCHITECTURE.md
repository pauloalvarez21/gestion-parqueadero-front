# Arquitectura del Sistema

## Descripción General

El sistema de gestión de parqueadero es una aplicación **Single Page Application (SPA)** desarrollada con **Angular 21**, que se comunica con un backend RESTful mediante peticiones HTTP.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Angular 21 App                         │   │
│  │                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │  Componentes │  │   Guards     │  │ Interceptors │   │   │
│  │  │  Standalone  │  │  (Auth/Role) │  │   (JWT)      │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                            │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │              Servicios HTTP                          │ │   │
│  │  │         (HttpClient + RxJS)                          │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │              Local Storage                           │ │   │
│  │  │         (Token JWT + Role)                           │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Servidor)                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Auth      │  │   Parqueo    │  │  Vehículos   │         │
│  │    API       │  │    API       │  │    API       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Tarifas    │  │  Historial   │  │  Facturación │         │
│  │    API       │  │    API       │  │    API       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Base de Datos                           │   │
│  │                   (MySQL/PostgreSQL)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  Login  │─────▶│  API    │─────▶│  JWT    │─────▶│  Guard  │
│  Form   │      │  Auth   │      │  Token  │      │  Check  │
└─────────┘      └─────────┘      └─────────┘      └─────────┘
                                         │
                                         ▼
                                   ┌─────────────┐
                                   │ LocalStorage│
                                   │ token + role│
                                   └─────────────┘
```

### Paso a Paso

1. **Login**: Usuario ingresa credenciales
2. **Validación**: Backend valida credenciales
3. **Token**: Backend devuelve JWT con rol
4. **Almacenamiento**: Frontend guarda token en localStorage
5. **Interceptor**: Todas las peticiones incluyen token
6. **Guards**: Rutas protegidas verifican token y rol

## Patrón de Diseño

### Componentes Standalone

Angular 21 utiliza componentes standalone por defecto:

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  // Lógica del componente
}
```

**Ventajas**:
- ✅ Menos boilerplate
- ✅ Imports explícitos
- ✅ Mejor tree-shaking
- ✅ Lazy loading natural

### Inyección de Dependencias

Uso de `inject()` en lugar de constructor:

```typescript
@Component({ ... })
export class MiComponente {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
}
```

### Manejo de Estado

**Señales (Signals)** para estado reactivo:

```typescript
@Component({ ... })
export class MiComponente {
  readonly title = signal('Mi Título');
  readonly items = signal<Item[]>([]);
  
  updateTitle(newTitle: string) {
    this.title.set(newTitle);
  }
}
```

**RxJS** para operaciones asíncronas:

```typescript
this.http.get<Item[]>(url).subscribe({
  next: (data) => this.items.set(data),
  error: (err) => this.error.set(err.message),
});
```

## Seguridad

### JWT Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Request Flow                             │
└─────────────────────────────────────────────────────────────┘

1. Login Request
   POST /api/auth/login
   Body: { username, password }
   
2. Login Response
   { token: "eyJhbGc...", role: "ADMIN" }
   
3. Store in LocalStorage
   localStorage.setItem('token', token);
   localStorage.setItem('role', role);
   
4. Subsequent Requests
   GET /api/parqueadero/espacios
   Headers: { Authorization: "Bearer eyJhbGc..." }
   
5. Interceptor (auth.interceptor.ts)
   - Automatically adds token to all requests
   - Handles 401/403 errors
```

### Guards

**auth.guard.ts**: Verifica autenticación

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return createUrlTreeFromSnapshot(route, ['/login']);
  }
  
  return true;
};
```

**role.guard.ts**: Verifica roles

```typescript
export const roleGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const allowedRoles = route.data['allowedRoles'];
  
  if (!allowedRoles.includes(role)) {
    return createUrlTreeFromSnapshot(route, ['/home']);
  }
  
  return true;
};
```

## Comunicación HTTP

### Interceptor

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return next(authReq);
  }
  
  return next(req);
};
```

### Servicios HTTP

Patrón de servicio HTTP:

```typescript
@Injectable({ providedIn: 'root' })
export class ParqueaderoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  
  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.baseUrl}/parqueadero/espacios`);
  }
  
  getTicketsActivos(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/parqueadero/tickets/activos`);
  }
  
  registrarEntrada(data: EntradaRequest): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/parqueadero/entrada`, data);
  }
}
```

## Manejo de Errores

### Global Error Handler

```typescript
// En el interceptor
catchError((error: HttpErrorResponse) => {
  if (error.status === 401) {
    // Token expirado - redirigir a login
    localStorage.removeItem('token');
    router.navigate(['/login']);
  } else if (error.status === 403) {
    // Acceso denegado
    alert('No tiene permisos para realizar esta acción');
  } else {
    // Error genérico
    alert('Ocurrió un error inesperado');
  }
  
  return throwError(() => error);
});
```

### Error en Componentes

```typescript
this.http.get(url).subscribe({
  next: (data) => {
    this.data = data;
    this.isLoading = false;
  },
  error: (err) => {
    this.errorMessage = err.error?.message || 'Error de conexión';
    this.isLoading = false;
  },
});
```

## Variables de Entorno

### environment.ts (Producción)

```typescript
export const environment = {
  production: true,
  baseUrl: 'https://api.parqueadero.com/api',
};
```

### environment.development.ts (Desarrollo)

```typescript
export const environment = {
  production: false,
  baseUrl: 'http://localhost:8082/api',
};
```

## Build y Deploy

### Build de Producción

```bash
ng build --configuration production
```

**Output**: `dist/gestion-parqueadero-front/`

**Optimizaciones**:
- ✅ Minificación de código
- ✅ Tree-shaking
- ✅ Lazy loading
- ✅ Hash en nombres de archivo
- ✅ Compresión de assets

### Deploy

```bash
# Copiar contents de dist/ al servidor web
cp -r dist/gestion-parqueadero-front/* /var/www/html/

# O usar servicios como Firebase, Vercel, Netlify
ng deploy
```

## Performance

### Lazy Loading

Las rutas se cargan bajo demanda:

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent),
  },
];
```

### Change Detection

Estrategia OnPush para mejor performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### TrackBy en ngFor

```typescript
<tr *ngFor="let item of items; trackBy: trackById">
```

## Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                           │
│                                                              │
│                         /\                                   │
│                        /  \                                  │
│                       / E2E \                                │
│                      /________\                              │
│                     /          \                             │
│                    / Integration \                           │
│                   /______________\                           │
│                  /                \                          │
│                 /    Unit Tests    \                         │
│                /____________________\                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Unit Tests (Jasmine + Karma)

- ✅ 78 pruebas unitarias
- ✅ Cobertura de componentes principales
- ✅ Mock de servicios HTTP
- ✅ Tests asíncronos con fakeAsync

### Integration Tests

- Pruebas de flujos completos
- Interacción entre componentes

### E2E Tests

- Pendiente de implementación
- Recomendado: Cypress o Playwright

## Recursos Adicionales

- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [RxJS Best Practices](https://rxjs.dev/guide/best-practices)
- [Angular Security Guide](https://angular.dev/guide/security)
- [Web Performance Best Practices](https://web.dev/performance/)
