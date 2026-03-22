# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-22

### ✨ Agregado

#### Componentes
- `LoginComponent` con autenticación JWT
- `HomeComponent` con menú dinámico por roles
- `DashboardComponent` con estadísticas en tiempo real
- `ActiveTicketsComponent` para ver tickets activos
- `VehiclesComponent` para gestión de vehículos
- `HistoryComponent` para historial de tickets
- `ParkingSpacesComponent` para gestión de espacios
- `MenuComponent` con navegación responsive
- `EntryRegistrationComponent` para registro de entrada
- `ExitComponent` para registro de salida
- `TariffManagementComponent` para gestión de tarifas
- `UserRegistrationComponent` para registro de usuarios
- `BillingConfigComponent` para configuración de facturación

#### Guards
- `authGuard` para verificar autenticación
- `roleGuard` para verificar roles de usuario

#### Interceptors
- `authInterceptor` para agregar token JWT automáticamente

#### Pruebas Unitarias
- 78 pruebas unitarias implementadas
- Configuración de Jasmine y Karma
- Tests para componentes principales:
  - Login (11 tests)
  - Menu (17 tests)
  - Vehicles (15 tests)
  - ParkingSpaces (13 tests)
  - History (9 tests)
  - Home (6 tests)
  - ActiveTickets (6 tests)
  - App (1 test)

#### Documentación
- README.md principal actualizado
- docs/TESTING.md - Guía de pruebas unitarias
- docs/STRUCTURE.md - Estructura del proyecto
- docs/ARCHITECTURE.md - Arquitectura del sistema
- docs/ONBOARDING.md - Guía para nuevos desarrolladores
- docs/STYLEGUIDE.md - Guía de estilos y mejores prácticas
- docs/README.md - Índice de documentación

### 🔧 Cambiado

#### Estructura del Proyecto
- Separado `HistoryComponent` de `HomeComponent` en carpeta independiente
- Separado `VehiclesComponent` de `ActiveTicketsComponent` en carpeta independiente
- Migrado de Vitest a Jasmine/Karma para pruebas unitarias

#### Configuración
- Actualizado a Angular 21.1.5
- Configurado Karma con ChromeHeadless
- Actualizado TypeScript a 5.9.2
- Actualizado Bootstrap a 5.3.8

### 🐛 Corregido

- Errores de navegación en pruebas unitarias
- Problemas de ExpressionChangedAfterItHasBeenCheckedError en tests
- Manejo adecuado de peticiones HTTP en componentes
- Limpieza de recursos en afterEach de tests

### 📦 Dependencias

#### Agregadas
- `@angular-devkit/build-angular@^21.2.0`
- `@types/jasmine`
- `jasmine-core@^5.x`
- `karma@^6.x`
- `karma-chrome-launcher`
- `karma-coverage`
- `karma-jasmine`
- `karma-jasmine-html-reporter`

#### Removidas
- `vitest` (migrado a Jasmine)
- `@angular/build:unit-test` (configuración experimental)

### 📝 Notas

- Todas las pruebas unitarias pasan exitosamente (78/78)
- La documentación está completa y actualizada
- El proyecto sigue las convenciones de Angular Style Guide
- Se implementaron mejores prácticas de testing

---

## [0.0.0] - 2026-03-XX

### ✨ Agregado

- Configuración inicial del proyecto
- Generación de componentes base
- Configuración de rutas
- Integración con Bootstrap

---

## Próximas Versiones

### Planeado para v1.1.0

- [ ] Pruebas E2E con Cypress o Playwright
- [ ] Mejorar cobertura de tests (>90%)
- [ ] Implementar lazy loading para módulos grandes
- [ ] Agregar más interceptores para manejo de errores
- [ ] Implementar caching con Service Workers
- [ ] Agregar modo oscuro
- [ ] Internacionalización (i18n)

### En Consideración

- Migración a Angular Signals para todo el estado
- Implementación de SSR (Server-Side Rendering)
- Uso de Esbuild para builds más rápidos
- Integración con Nx Monorepo

---

## Convenciones

### Tipos de Cambio

- `Added` (Agregado): Nuevas características
- `Changed` (Cambiado): Cambios en funcionalidad existente
- `Deprecated` (Obsoleto): Características que serán removidas
- `Removed` (Removido): Características removidas
- `Fixed` (Corregido): Corrección de bugs
- `Security` (Seguridad): Mejoras de seguridad

### Versiones

- `MAJOR.MINOR.PATCH`
- `MAJOR`: Cambios incompatibles
- `MINOR`: Nuevas características (compatibles)
- `PATCH`: Correcciones de bugs (compatibles)

---

**[1.0.0]**: 2026-03-22 - Lanzamiento inicial con documentación completa
