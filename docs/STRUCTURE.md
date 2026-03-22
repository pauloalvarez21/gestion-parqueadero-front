# Estructura del Proyecto

## Visión General

```
gestion-parqueadero-front/
│
├── 📁 .angular/                    # Caché de Angular (auto-generado)
├── 📁 .vscode/                     # Configuración de VS Code
├── 📁 dist/                        # Build de producción (auto-generado)
├── 📁 docs/                        # Documentación del proyecto
├── 📁 node_modules/                # Dependencias de npm
├── 📁 public/                      # Assets estáticos
├── 📁 src/                         # Código fuente
│   ├── 📁 app/                     # Componentes de la aplicación
│   ├── 📁 environments/            # Variables de entorno
│   ├── index.html                  # HTML principal
│   ├── main.ts                     # Punto de entrada
│   ├── styles.css                  # Estilos globales
│   ├── test.ts                     # Configuración de tests
│   └── polyfills.ts                # Polyfills
├── angular.json                    # Configuración de Angular CLI
├── karma.conf.js                   # Configuración de Karma
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración de TypeScript
└── README.md                       # Documentación principal
```

## Estructura de src/app/

```
src/app/
│
├── 📁 active-tickets/              # Gestión de tickets activos
│   ├── active-tickets.ts           # Lógica del componente
│   ├── active-tickets.html         # Template
│   ├── active-tickets.css          # Estilos
│   └── active-tickets.spec.ts      # Pruebas unitarias
│
├── 📁 billing-config/              # Configuración de facturación
│   ├── billing-config.ts
│   ├── billing-config.html
│   └── billing-config.css
│
├── 📁 dashboard/                   # Dashboard principal
│   ├── dashboard.ts
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.spec.ts
│
├── 📁 entry-registration/          # Registro de entrada
│   ├── entry-registration.ts
│   ├── entry-registration.html
│   └── entry-registration.css
│
├── 📁 exit/                        # Registro de salida
│   ├── exit.ts
│   ├── exit.html
│   └── exit.css
│
├── 📁 guards/                      # Guards de autenticación
│   ├── auth.guard.ts               # Verifica si está autenticado
│   └── role.guard.ts               # Verifica roles de usuario
│
├── 📁 history/                     # Historial de tickets
│   ├── history.ts
│   ├── history.html
│   ├── history.css
│   └── history.spec.ts
│
├── 📁 home/                        # Página principal
│   ├── home.ts
│   ├── home.html
│   ├── home.css
│   └── home.spec.ts
│
├── 📁 login/                       # Login de usuarios
│   ├── login.ts
│   ├── login.html
│   ├── login.css
│   └── login.spec.ts
│
├── 📁 menu/                        # Menú de navegación
│   ├── menu.ts
│   ├── menu.html
│   ├── menu.css
│   └── menu.spec.ts
│
├── 📁 parking-spaces/              # Gestión de espacios
│   ├── parking-spaces.ts
│   ├── parking-spaces.html
│   ├── parking-spaces.css
│   └── parking-spaces.spec.ts
│
├── 📁 tariff-management/           # Gestión de tarifas
│   ├── tariff-management.ts
│   ├── tariff-management.html
│   └── tariff-management.css
│
├── 📁 user-registration/           # Registro de usuarios
│   ├── user-registration.ts
│   ├── user-registration.html
│   └── user-registration.css
│
├── 📁 vehicles/                    # Gestión de vehículos
│   ├── vehicles.ts
│   ├── vehicles.html
│   ├── vehicles.css
│   └── vehicles.spec.ts
│
├── app.config.ts                   # Configuración de la app
├── app.routes.ts                   # Definición de rutas
├── app.ts                          # Componente raíz
├── app.html                        # Template raíz
├── app.css                         # Estilos raíz
└── auth.interceptor.ts             # Interceptor HTTP para auth
```

## Detalle de Carpetas

### 📁 active-tickets/

**Propósito**: Mostrar y gestionar los tickets activos (vehículos estacionados)

**Archivos**:
- `active-tickets.ts`: Componente que obtiene y muestra tickets activos
- `active-tickets.html`: Tabla con información de vehículos
- `active-tickets.css`: Estilos de la tabla
- `active-tickets.spec.ts`: 6 pruebas unitarias

**Ruta**: `/tickets`

**Roles**: ADMIN, OPERADOR

---

### 📁 dashboard/

**Propósito**: Vista general del estado del parqueadero

**Características**:
- Estadísticas en tiempo real
- Espacios disponibles/ocupados
- Ingresos del día/mes
- Últimos movimientos

**Ruta**: `/dashboard`

**Roles**: ADMIN, OPERADOR, USER

---

### 📁 entry-registration/

**Propósito**: Registrar la entrada de vehículos

**Funcionalidades**:
- Selección de espacio
- Captura de placa
- Generación de ticket

**Ruta**: `/entry`

**Roles**: ADMIN, OPERADOR

---

### 📁 exit/

**Propósito**: Registrar la salida de vehículos

**Funcionalidades**:
- Búsqueda de ticket activo
- Cálculo de tarifa
- Generación de factura

**Ruta**: `/exit`

**Roles**: ADMIN, OPERADOR

---

### 📁 guards/

**Propósito**: Proteger rutas y verificar permisos

**Archivos**:
- `auth.guard.ts`: Verifica si el usuario está autenticado
- `role.guard.ts`: Verifica si el usuario tiene el rol requerido

**Uso**:
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard],
  data: { allowedRoles: ['ADMIN'] }
}
```

---

### 📁 history/

**Propósito**: Consultar historial de tickets finalizados

**Funcionalidades**:
- Lista de tickets históricos
- Filtros por fecha
- Exportar reportes

**Ruta**: `/history`

**Roles**: ADMIN

**Pruebas**: 9 tests unitarios

---

### 📁 home/

**Propósito**: Página principal con menú de acciones

**Características**:
- Menú dinámico según rol
- Accesos rápidos
- Bienvenida al usuario

**Ruta**: `/home`

**Roles**: ADMIN, OPERADOR, USER

**Pruebas**: 6 tests unitarios

---

### 📁 login/

**Propósito**: Autenticación de usuarios

**Funcionalidades**:
- Formulario de login
- Validación de credenciales
- Almacenamiento de token JWT
- Decodificación de rol

**Ruta**: `/login`

**Roles**: Público

**Pruebas**: 11 tests unitarios

---

### 📁 menu/

**Propósito**: Menú de navegación principal

**Características**:
- Menú responsive
- Items dinámicos según rol
- Indicador de usuario logueado

**Selector**: `<app-menu>`

**Pruebas**: 17 tests unitarios

---

### 📁 parking-spaces/

**Propósito**: Gestionar espacios de parqueo

**Funcionalidades**:
- CRUD de espacios
- Agregar/eliminar por tipo
- Visualización de estado

**Ruta**: `/spaces`

**Roles**: ADMIN, OPERADOR

**Pruebas**: 13 tests unitarios

---

### 📁 tariff-management/

**Propósito**: Configurar tarifas del parqueadero

**Funcionalidades**:
- Tarifas por tipo de vehículo
- Precios por minuto/hora/día
- Tarifas especiales

**Ruta**: `/tariffs`

**Roles**: ADMIN

---

### 📁 user-registration/

**Propósito**: Registrar nuevos usuarios

**Funcionalidades**:
- Formulario de registro
- Asignación de roles
- Validación de datos

**Ruta**: `/registration`

**Roles**: ADMIN

---

### 📁 vehicles/

**Propósito**: Gestionar directorio de vehículos

**Funcionalidades**:
- CRUD de vehículos
- Búsqueda por placa
- Información de propietarios
- Paginación

**Ruta**: `/vehicles`

**Roles**: ADMIN, OPERADOR

**Pruebas**: 15 tests unitarios

---

## Archivos Principales

### app.routes.ts

Define todas las rutas de la aplicación:

```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR', 'USER'] }
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR', 'USER'] }
  },
  // ... más rutas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
```

### app.config.ts

Configuración global de la aplicación:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
  ],
};
```

### auth.interceptor.ts

Interceptor para agregar token JWT a todas las peticiones HTTP:

```typescript
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

## Convenciones de Nomenclatura

### Componentes

- **Nombre de archivo**: `kebab-case` (ej: `parking-spaces.ts`)
- **Nombre de clase**: `PascalCase` (ej: `ParkingSpacesComponent`)
- **Selector**: `kebab-case` con prefijo `app` (ej: `app-parking-spaces`)

### Variables y Funciones

- **Variables**: `camelCase` (ej: `selectedSpace`)
- **Constantes**: `camelCase` o `UPPER_CASE` para constantes globales
- **Funciones**: `camelCase` (ej: `loadSpaces()`)
- **Privadas**: prefijo `_` (ej: `_privateVar`)

### Estilos

- **Clases CSS**: `kebab-case` (ej: `.space-card`)
- **Modificadores**: doble guión (ej: `.space-card--occupied`)

## Dependencias Principales

```json
{
  "dependencies": {
    "@angular/common": "^21.1.0",
    "@angular/core": "^21.1.0",
    "@angular/router": "^21.1.0",
    "@angular/forms": "^21.1.0",
    "bootstrap": "^5.3.8",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^21.2.0",
    "@angular/cli": "^21.1.5",
    "@types/jasmine": "^5.x",
    "jasmine-core": "^5.x",
    "karma": "^6.x",
    "typescript": "~5.9.2"
  }
}
```

## Recursos Adicionales

- [Angular Style Guide](https://angular.dev/guide/styleguide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
