import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Usamos un signal para el estado reactivo del tema actual.
  currentTheme = signal<Theme>('auto');

  constructor() {
    this.loadTheme();
  }

  /**
   * Carga el tema guardado en localStorage o detecta la preferencia del sistema.
   */
  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.setTheme(savedTheme || 'auto');
  }

  /**
   * Cambia el tema actual y lo guarda en localStorage.
   * @param theme El tema a establecer ('light', 'dark', o 'auto').
   */
  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);

    let effectiveTheme: 'light' | 'dark';

    if (theme === 'auto') {
      // Detecta la preferencia del sistema si el tema es 'auto'
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    } else {
      effectiveTheme = theme;
    }

    // Aplica el atributo data-bs-theme al elemento <html>
    document.documentElement.setAttribute('data-bs-theme', effectiveTheme);
  }

  /**
   * Alterna entre el tema claro y oscuro.
   */
  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
