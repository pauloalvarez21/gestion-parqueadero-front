# Sistema de Gestión de Parqueadero - Frontend

Aplicación Angular para la gestión integral de parqueaderos, desarrollada con Angular 21 y Jasmine/Karma para pruebas unitarias.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Comandos Útiles](#-comandos-útiles)
- [Pruebas Unitarias](#-pruebas-unitarias)
- [Arquitectura](#-arquitectura)
- [Contribución](#-contribución)

## ✨ Características

- **Autenticación**: Login con roles (ADMIN, OPERADOR, USER)
- **Dashboard**: Vista general del estado del parqueadero
- **Gestión de Espacios**: CRUD de espacios de parqueo
- **Control de Acceso**: Registro de entrada y salida de vehículos
- **Tickets Activos**: Monitoreo de vehículos estacionados
- **Historial**: Consulta de tickets finalizados
- **Gestión de Vehículos**: Directorio de vehículos y propietarios
- **Tarifas**: Configuración de precios
- **Facturación**: Integración con resolución DIAN

## 🛠 Requisitos Previos

- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **Angular CLI**: v21.x

```bash
# Verificar versiones
node --version
npm --version
ng version
```

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd gestion-parqueadero-front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Abrir en navegador
http://localhost:4200/
```

## 📁 Estructura del Proyecto

```
gestion-parqueadero-front/
├── src/
│   ├── app/
│   │   ├── active-tickets/       # Componente: Tickets activos
│   │   │   ├── active-tickets.ts
│   │   │   ├── active-tickets.html
│   │   │   ├── active-tickets.css
│   │   │   └── active-tickets.spec.ts    ✅ Tests
│   │   ├── billing-config/         # Configuración de facturación
│   │   ├── dashboard/              # Dashboard principal
│   │   ├── entry-registration/     # Registro de entrada
│   │   ├── exit/                   # Registro de salida
│   │   ├── guards/                 # Guards de autenticación
│   │   ├── history/                # Historial de tickets ✅ Tests
│   │   ├── home/                   # Página principal ✅ Tests
│   │   ├── login/                  # Login ✅ Tests
│   │   ├── menu/                   # Menú de navegación ✅ Tests
│   │   ├── parking-spaces/         # Gestión de espacios ✅ Tests
│   │   ├── tariff-management/      # Gestión de tarifas
│   │   ├── user-registration/      # Registro de usuarios
│   │   ├── vehicles/               # Gestión de vehículos ✅ Tests
│   │   ├── app.config.ts           # Configuración de la app
│   │   ├── app.routes.ts           # Rutas de la aplicación
│   │   └── auth.interceptor.ts     # Interceptor de autenticación
│   ├── environments/
│   │   ├── environment.ts          # Variables de entorno (producción)
│   │   └── environment.development.ts  # Variables de entorno (desarrollo)
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── test.ts                     # Configuración de tests
│   └── polyfills.ts
├── karma.conf.js                   # Configuración de Karma
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# Iniciar con recarga automática
ng serve --watch

# Compilar y servir
ng serve --port 4200
```

### Build

```bash
# Build de desarrollo
ng build

# Build de producción
ng build --configuration production

# Build con estadísticas
ng build --stats-json
```

### Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar en modo vigilancia
npm run test -- --watch

# Ejecutar en Chrome (no headless)
npm run test -- --browsers=Chrome

# Ejecutar pruebas específicas
npm run test -- --include='src/app/login/*.spec.ts'

# Ejecutar con reporte de cobertura
npm run test -- --code-coverage
```

### Linting y Formato

```bash
# Ejecutar linter
ng lint

# Formatear código con Prettier
npx prettier --write "src/**/*.{ts,html,css}"
```

## 🧪 Pruebas Unitarias

El proyecto utiliza **Jasmine** y **Karma** para pruebas unitarias.

### Estructura de Pruebas

Cada componente tiene su archivo `.spec.ts` con pruebas para:

- ✅ Creación del componente
- ✅ Inicialización de propiedades
- ✅ Llamadas HTTP (mockeadas con HttpClientTestingModule)
- ✅ Manejo de errores
- ✅ Interacción con el usuario

### Ejemplo de Prueba

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Cobertura de Pruebas

| Componente | # Pruebas | Estado |
|------------|-----------|--------|
| App | 1 | ✅ |
| ActiveTickets | 6 | ✅ |
| Vehicles | 15 | ✅ |
| History | 9 | ✅ |
| Login | 11 | ✅ |
| Home | 6 | ✅ |
| Menu | 17 | ✅ |
| ParkingSpaces | 13 | ✅ |
| **TOTAL** | **78** | ✅ |

## 🏗 Arquitectura

### Patrón de Diseño

- **Componentes Standalone**: Angular 21 con componentes independientes
- **Inyección de Dependencias**: `inject()` para servicios
- **Señales**: `signal()` para estado reactivo
- **HTTP Client**: Para comunicación con el backend

### Flujo de Autenticación

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────▶│  Auth Guard  │────▶│   Home      │
│  Component  │     │  +  Role     │     │  Dashboard  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  JWT Token   │
                    │  LocalStorage│
                    └──────────────┘
```

### Servicios Principales

| Servicio | Descripción |
|----------|-------------|
| `auth.interceptor.ts` | Interceptor para agregar token JWT |
| `auth.guard.ts` | Guard para rutas protegidas |
| `role.guard.ts` | Guard para verificar roles |

## 🤝 Contribución

### Flujo de Trabajo

1. **Fork** el repositorio
2. **Clona** tu fork
3. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. **Push** a la rama (`git push origin feature/AmazingFeature`)
6. **Pull Request**

### Convenciones de Código

- **TypeScript**: Estricto, con tipado explícito
- **Componentes**: Standalone con imports explícitos
- **Estilos**: CSS con metodología BEM
- **Nomenclatura**: 
  - Componentes: `kebab-case` (ej: `parking-spaces`)
  - Clases: `PascalCase` (ej: `ParkingSpacesComponent`)
  - Variables: `camelCase` (ej: `selectedSpace`)

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: agregar pruebas
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para reportar bugs o solicitar features, por favor crea un issue en el repositorio.

---

**Desarrollado con ❤️ usando Angular 21**
