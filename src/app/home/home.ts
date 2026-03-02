import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  // Lista de acciones disponibles en el dashboard
  actions = [
    { 
      title: 'Registrar Entrada', 
      icon: 'bi-box-arrow-in-right', 
      description: 'Registrar el ingreso de un vehículo al parqueadero.', 
      link: '/entry',
      color: 'text-success'
    },
    { 
      title: 'Registrar Salida', 
      icon: 'bi-box-arrow-left', 
      description: 'Procesar la salida de un vehículo y calcular pago.', 
      link: '/exit',
      color: 'text-danger'
    },
    { 
      title: 'Crear Usuario', 
      icon: 'bi-person-plus-fill', 
      description: 'Registrar un nuevo operador o administrador.', 
      link: '/registration',
      color: 'text-primary'
    },
    { 
      title: 'Gestionar Espacios', 
      icon: 'bi-grid-3x3-gap-fill', 
      description: 'Ver y administrar los espacios de parqueo.', 
      link: '/spaces',
      color: 'text-info'
    },
    { 
      title: 'Tarifas', 
      icon: 'bi-currency-dollar', 
      description: 'Configurar los precios por minuto, hora o día.', 
      link: '/tariffs',
      color: 'text-warning'
    },
    { 
      title: 'Documentación API', 
      icon: 'bi-file-earmark-code', 
      description: 'Consultar la documentación técnica del sistema.', 
      link: '/docs',
      color: 'text-secondary'
    }
  ];
}