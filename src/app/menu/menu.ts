import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  isLoggedIn: boolean = false;
  username: string | null = '';
  role: string | null = '';

  // Definición de todas las opciones del menú y sus permisos
  private readonly allMenuItems = [
    {
      title: 'Inicio',
      icon: 'bi-house-door-fill',
      link: '/home',
      allowedRoles: ['ADMIN', 'OPERADOR', 'USER'],
    },
    {
      title: 'Entrada',
      icon: 'bi-box-arrow-in-right',
      link: '/entry',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Salida',
      icon: 'bi-box-arrow-left',
      link: '/exit',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Tickets',
      icon: 'bi-ticket-perforated-fill',
      link: '/tickets',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Espacios',
      icon: 'bi-grid-3x3-gap-fill',
      link: '/spaces',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Vehículos',
      icon: 'bi-car-front-fill',
      link: '/vehicles',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    { title: 'Tarifas', icon: 'bi-currency-dollar', link: '/tariffs', allowedRoles: ['ADMIN'] },
    {
      title: 'Usuarios',
      icon: 'bi-person-plus-fill',
      link: '/registration',
      allowedRoles: ['ADMIN'],
    },
    {
      title: 'Estadísticas',
      icon: 'bi-bar-chart-line-fill',
      link: '/statistics',
      allowedRoles: ['ADMIN'],
    },
    {
      title: 'Docs',
      icon: 'bi-file-earmark-code',
      link: '/docs',
      allowedRoles: ['ADMIN', 'OPERADOR', 'USER'],
    },
  ];

  constructor(private router: Router) {
    // Suscribirse a los eventos de navegación para actualizar el menú automáticamente
    // Esto asegura que el menú aparezca/desaparezca al hacer login/logout
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLogin();
    });
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(): void {
    // Ocultar el menú explícitamente si estamos en la página de login
    if (this.router.url === '/login') {
      this.isLoggedIn = false;
      return;
    }

    const token = localStorage.getItem('token');
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username'); // Opcional: si guardas el nombre de usuario

    if (token && this.role) {
      this.isLoggedIn = true;
      const currentRole = this.role.trim().toUpperCase();
      // Filtrar opciones según el rol
      this.menuItems = this.allMenuItems.filter((item) => item.allowedRoles.includes(currentRole));
    } else {
      this.isLoggedIn = false;
      this.menuItems = [];
    }
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
