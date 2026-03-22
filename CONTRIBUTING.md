# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Esta guía te ayudará a entender cómo puedes participar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#-código-de-conducta)
- [Cómo Contribuir](#-cómo-contribuir)
- [Flujo de Trabajo](#-flujo-de-trabajo)
- [Estándares de Código](#-estándares-de-código)
- [Pull Requests](#-pull-requests)
- [Reporte de Bugs](#-reporte-de-bugs)
- [Solicitud de Features](#-solicitud-de-features)

---

## 🤝 Código de Conducta

- Sé respetuoso con otros contribuyentes
- Mantén un tono profesional en las discusiones
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad

---

## 🚀 Cómo Contribuir

### Tipos de Contribución

1. **Reportar bugs**
2. **Sugerir nuevas características**
3. **Escribir código**
4. **Mejorar documentación**
5. **Revisar Pull Requests**
6. **Escribir pruebas**

---

## 🔄 Flujo de Trabajo

### 1. Fork del Repositorio

```bash
# Haz click en "Fork" en GitHub
# O usa la CLI de GitHub
gh repo fork <url-del-repositorio>
```

### 2. Clona tu Fork

```bash
git clone https://github.com/TU-USUARIO/gestion-parqueadero-front.git
cd gestion-parqueadero-front
```

### 3. Configura Upstream

```bash
# Agrega el repositorio original como remote
git remote add upstream https://github.com/OWNER/gestion-parqueadero-front.git

# Verifica los remotes
git remote -v
```

### 4. Crea una Rama

```bash
# Siempre trabaja en una rama nueva
git checkout -b feature/mi-nueva-feature

# Convenciones de nombres:
# feature/nombre-de-la-feature
# fix/nombre-del-bug
# docs/cambio-de-documentacion
# refactor/refactorizacion
# test/agregar-pruebas
```

### 5. Realiza tus Cambios

```bash
# Edita los archivos necesarios
# Asegúrate de seguir los estándares de código

# Ejecuta las pruebas
npm run test

# Verifica el linting
ng lint
```

### 6. Commit de Cambios

```bash
# Agrega los cambios
git add .

# Haz commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad"

# Convenciones de commit:
# feat: nueva característica
# fix: corrección de bug
# docs: cambios en documentación
# style: cambios de formato
# refactor: refactorización
# test: agregar pruebas
# chore: tareas de mantenimiento
```

### 7. Push a tu Fork

```bash
git push origin feature/mi-nueva-feature
```

### 8. Crea el Pull Request

1. Ve a tu fork en GitHub
2. Click en "Pull Request"
3. Completa la plantilla
4. Espera la revisión

---

## 📝 Estándares de Código

### TypeScript

```typescript
// ✅ CORRECTO
export class MiComponente {
  private readonly http = inject(HttpClient);
  
  isLoading = false;
  items: Item[] = [];
  
  loadData(): void {
    // Implementación
  }
}

// ❌ INCORRECTO
export class MiComponente {
  constructor(private http: HttpClient) {} // Usar inject()
  
  data: any; // Evitar 'any'
  
  loadData() { // Falta tipo de retorno
    // Implementación
  }
}
```

### Componentes

```typescript
// ✅ CORRECTO
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-componente.html',
  styleUrls: ['./mi-componente.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### Estilos

```css
/* ✅ CORRECTO - BEM */
.space-card { }
.space-card__title { }
.space-card--occupied { }

/* ❌ INCORRECTO */
.container .row .col .card { }
```

### Pruebas

```typescript
// ✅ CORRECTO
describe('MiComponente', () => {
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load data on init', () => {
    // Test específico
  });
});

// ❌ INCORRECTO
describe('Tests', () => {
  it('test 1', () => {
    // Test genérico
  });
});
```

---

## 📤 Pull Requests

### Antes de Enviar

- [ ] El código sigue los estándares del proyecto
- [ ] Las pruebas pasan localmente
- [ ] El linting no muestra errores
- [ ] La documentación está actualizada
- [ ] Los commits siguen las convenciones

### Plantilla de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Linting pasa
- [ ] Tests pasan

## Screenshots (si aplica)
[Agregar screenshots]

## Issue relacionado
Closes #123
```

---

## 🐛 Reporte de Bugs

### Plantilla de Bug Report

```markdown
**Descripción del bug**
Descripción clara y concisa del bug

**Para reproducir**
Pasos para reproducir:
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento esperado**
Lo que debería pasar

**Screenshots**
Si aplica

**Entorno:**
- OS: [Windows, Mac, Linux]
- Browser: [Chrome, Firefox, Safari]
- Version: [ej. 22]

**Contexto adicional**
Cualquier otra información relevante
```

---

## ✨ Solicitud de Features

### Plantilla de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase

**Describe alternativas que has considerado**
Otras soluciones que has pensado

**Contexto adicional**
Cualquier otra información, screenshots, mockups, etc.
```

---

## 📚 Recursos

### Documentación

- [README.md](./README.md)
- [docs/ONBOARDING.md](./docs/ONBOARDING.md)
- [docs/STYLEGUIDE.md](./docs/STYLEGUIDE.md)
- [docs/TESTING.md](./docs/TESTING.md)

### Herramientas

- [Angular CLI](https://angular.dev/tools/cli)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Jasmine](https://jasmine.github.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🏆 Reconocimientos

Los contribuyentes serán reconocidos en:

1. El archivo CONTRIBUTORS.md
2. El CHANGELOG.md
3. Los release notes

---

## 📞 Contacto

- **Email**: [tu-email@empresa.com]
- **Slack**: [#frontend-team]
- **GitHub Issues**: [url-del-repositorio]/issues

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tiempo toma revisar un PR?

Generalmente 2-3 días hábiles.

### ¿Puedo ayudar si soy principiante?

¡Sí! Hay issues etiquetados como `good first issue` perfectos para comenzar.

### ¿Necesito firmar algún acuerdo?

No, pero tu código estará bajo la licencia del proyecto.

### ¿Cómo sé si mi feature será aceptada?

Abre un issue primero para discutir la idea.

---

**¡Gracias por contribuir! 🎉**
