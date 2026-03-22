# Guía de Inicio Rápido

## Para Desarrolladores Nuevos

### 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v20.x o superior
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recomendado)

### 2. Configuración Inicial

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd gestion-parqueadero-front

# Instalar dependencias
npm install

# Verificar instalación
ng version
```

### 3. Iniciar el Proyecto

```bash
# Iniciar servidor de desarrollo
ng serve

# Abrir navegador
http://localhost:4200/
```

### 4. Configurar Backend

El proyecto se conecta al backend en `http://localhost:8082/api`.

Si el backend está en otra URL, edita `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  baseUrl: 'http://tu-url-backend/api',
};
```

### 5. Primeros Pasos

#### Explorar la Estructura

```
src/app/
├── login/          # Comienza aquí - Autenticación
├── home/           # Página principal
├── menu/           # Menú de navegación
└── dashboard/      # Vista general
```

#### Entender el Flujo

1. **Login** → Ingresa credenciales
2. **Home** → Menú según tu rol
3. **Dashboard** → Vista general del parqueadero

### 6. Comandos Esenciales

```bash
# Desarrollo
ng serve                    # Iniciar servidor
ng serve --port 4300        # En otro puerto

# Build
ng build                    # Compilar
ng build --prod             # Producción

# Tests
npm run test                # Ejecutar tests
npm run test -- --watch     # Modo vigilancia

# Utilidades
ng generate component xyz   # Crear componente
ng lint                     # Verificar código
```

### 7. Crear tu Primer Componente

```bash
# Generar componente
ng generate component mi-componente

# Estructura creada:
# src/app/mi-componente/
#   ├── mi-componente.ts
#   ├── mi-componente.html
#   ├── mi-componente.css
#   └── mi-componente.spec.ts
```

### 8. Agregar una Nueva Ruta

Edita `src/app/app.routes.ts`:

```typescript
{
  path: 'mi-ruta',
  component: MiComponente,
  canActivate: [authGuard, roleGuard],
  data: { allowedRoles: ['ADMIN', 'OPERADOR'] }
}
```

### 9. Conectar con el Backend

```typescript
// En tu componente
private readonly http = inject(HttpClient);

this.http.get(`${environment.baseUrl}/api/endpoint`).subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
});
```

### 10. Escribir Tests

```typescript
// mi-componente.spec.ts
describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Problemas Comunes

### Error: Puerto ya en uso

```bash
# Matar proceso en puerto 4200
npx kill-port 4200

# O usar otro puerto
ng serve --port 4300
```

### Error: Node modules desactualizados

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: CORS en desarrollo

El backend debe permitir CORS desde `http://localhost:4200`

### Error: Token expirado

```bash
# Limpiar localStorage
localStorage.clear()

# Volver a login
```

## Recursos de Aprendizaje

### Documentación Oficial

- [Angular Docs](https://angular.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [RxJS Docs](https://rxjs.dev/)

### Tutoriales

- [Angular para principiantes](https://angular.dev/tutorials)
- [RxJS Learning](https://rxjs.dev/learning-rxjs)

### Herramientas

- [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools) (Extensión de Chrome)
- [Postman](https://www.postman.com/) (Para probar APIs)

## Convenciones del Proyecto

### Nomenclatura

```typescript
// Componentes: kebab-case
parking-spaces.component.ts

// Clases: PascalCase
ParkingSpacesComponent

// Variables: camelCase
selectedSpace, isLoading

// Constantes: UPPER_CASE
MAX_SPACES, API_URL
```

### Estructura de Componentes

```typescript
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-componente.html',
  styleUrls: ['./mi-componente.css'],
})
export class MiComponente {
  // 1. Inyección de dependencias
  private readonly http = inject(HttpClient);
  
  // 2. Propiedades
  isLoading = false;
  data: any[] = [];
  
  // 3. Lifecycle hooks
  ngOnInit() {
    this.loadData();
  }
  
  // 4. Métodos públicos
  loadData() {
    // ...
  }
  
  // 5. Métodos privados
  private _helperMethod() {
    // ...
  }
}
```

### Estilos

```css
/* Usar clases descriptivas */
.space-card { }
.space-card--occupied { }
.space-card__title { }
```

## Checklist del Primer Día

- [ ] Clonar repositorio
- [ ] Instalar dependencias
- [ ] Iniciar servidor de desarrollo
- [ ] Explorar estructura del proyecto
- [ ] Entender flujo de autenticación
- [ ] Crear componente de prueba
- [ ] Escribir primer test
- [ ] Leer documentación del proyecto

## Soporte

- 📧 Email: [tu-email@empresa.com]
- 💬 Slack: [#frontend-team]
- 📚 Wiki: [url-de-la-wiki]

---

**¡Bienvenido al equipo! 🚀**
