import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Action {
  title: string;
  icon: string;
  description: string;
  link: string;
  color: string;
  allowedRoles: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  actions: Action[] = [];

  // Lista de acciones disponibles en el dashboard
  private readonly allActions: Action[] = [
    {
      title: 'Registrar Entrada',
      icon: 'bi-box-arrow-in-right',
      description: 'Registrar el ingreso de un vehículo al parqueadero.',
      link: '/entry',
      color: 'text-success',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Registrar Salida',
      icon: 'bi-box-arrow-left',
      description: 'Procesar la salida de un vehículo y calcular pago.',
      link: '/exit',
      color: 'text-danger',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Tickets Activos',
      icon: 'bi-ticket-perforated-fill',
      description: 'Ver lista de vehículos estacionados actualmente.',
      link: '/tickets',
      color: 'text-primary',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Crear Usuario',
      icon: 'bi-person-plus-fill',
      description: 'Registrar un nuevo operador o administrador.',
      link: '/registration',
      color: 'text-primary',
      allowedRoles: ['ADMIN'],
    },
    {
      title: 'Gestionar Espacios',
      icon: 'bi-grid-3x3-gap-fill',
      description: 'Ver y administrar los espacios de parqueo.',
      link: '/spaces',
      color: 'text-info',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Tarifas',
      icon: 'bi-currency-dollar',
      description: 'Configurar los precios por minuto, hora o día.',
      link: '/tariffs',
      color: 'text-warning',
      allowedRoles: ['ADMIN'],
    },
    {
      title: 'Vehículos',
      icon: 'bi-car-front-fill',
      description: 'Administrar directorio de vehículos y propietarios.',
      link: '/vehicles',
      color: 'text-secondary',
      allowedRoles: ['ADMIN', 'OPERADOR'],
    },
    {
      title: 'Estadísticas',
      icon: 'bi-bar-chart-line-fill',
      description: 'Ver estadísticas de ocupación e ingresos.',
      link: '/statistics',
      color: 'text-dark',
      allowedRoles: ['ADMIN'],
    },
    {
      title: 'Documentación API',
      icon: 'bi-file-earmark-code',
      description: 'Consultar la documentación técnica del sistema.',
      link: '/docs',
      color: 'text-secondary',
      allowedRoles: ['ADMIN', 'OPERADOR', 'USER'],
    },
  ];

  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role) {
      const currentRole = role.trim().toUpperCase();
      console.log('Rol detectado en Home:', currentRole); // Para depuración
      this.actions = this.allActions.filter((action) => action.allowedRoles.includes(currentRole));
    }
  }
}
