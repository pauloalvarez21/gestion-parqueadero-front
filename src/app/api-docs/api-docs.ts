import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-docs.html',
  styleUrls: ['./api-docs.css'],
})
export class ApiDocsComponent {
  apiInfo = {
    title: 'API Gestión Parqueadero',
    description: 'API para la gestión de entradas, salidas, pagos y espacios de un parqueadero.',
    version: '1.2.0',
    server: 'http://localhost:8082',
  };

  endpoints = [
    {
      path: '/api/auth/register',
      method: 'POST',
      summary: 'Registrar nuevo usuario',
      tags: ['Auth'],
      requestBody: 'AuthRequest',
      responses: { '200': 'Usuario registrado exitosamente (AuthResponse)' },
    },
    {
      path: '/api/auth/login',
      method: 'POST',
      summary: 'Iniciar sesión',
      tags: ['Auth'],
      requestBody: 'AuthRequest',
      responses: { '200': 'Login exitoso (AuthResponse)' },
    },
    {
      path: '/api/auth/eliminar/{username}',
      method: 'DELETE',
      summary: 'Eliminar un usuario por username',
      tags: ['Auth'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'username',
          in: 'path',
          required: true,
          description: 'Nombre de usuario a eliminar',
        },
      ],
      responses: { '204': 'Usuario eliminado exitosamente', '404': 'Usuario no encontrado' },
    },
    {
      path: '/api/parqueadero/entrada',
      method: 'POST',
      summary: 'Registrar entrada de vehículo',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      requestBody: 'EntradaRequest',
      responses: { '200': 'Entrada registrada (TicketDTO)' },
    },
    {
      path: '/api/parqueadero/salida',
      method: 'POST',
      summary: 'Registrar salida de vehículo y calcular pago',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      requestBody: 'SalidaRequest',
      responses: { '200': 'Salida procesada (PagoResponse)' },
    },
    {
      path: '/api/parqueadero/tickets/{codigo}',
      method: 'GET',
      summary: 'Obtener ticket por código',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'codigo',
          in: 'path',
          required: true,
          description: 'Código del ticket (ej. TKT-12345)',
        },
      ],
      responses: { '200': 'Detalle del ticket (TicketDTO)' },
    },
    {
      path: '/api/parqueadero/tickets/activos',
      method: 'GET',
      summary: 'Listar tickets activos',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      responses: { '200': 'Lista de tickets activos (Array<TicketDTO>)' },
    },
    {
      path: '/api/parqueadero/espacios',
      method: 'GET',
      summary: 'Listar todos los espacios',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      responses: { '200': 'Lista de espacios (Array<EspacioDTO>)' },
    },
    {
      path: '/api/parqueadero/espacios/agregar',
      method: 'POST',
      summary: 'Agregar nuevos espacios',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      requestBody: 'AgregarEspaciosRequest',
      responses: { '200': 'Espacios creados (Array<EspacioDTO>)' },
    },
    {
      path: '/api/parqueadero/espacios/eliminar',
      method: 'DELETE',
      summary: 'Eliminar espacios de parqueadero disponibles',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      requestBody: 'EliminarEspaciosRequest',
      responses: { '200': 'Espacios eliminados exitosamente (Array<EspacioDTO>)' },
    },
    {
      path: '/api/parqueadero/estadisticas',
      method: 'GET',
      summary: 'Obtener estadísticas del parqueadero',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      responses: { '200': 'Estadísticas actuales (EstadisticasDTO)' },
    },
    {
      path: '/api/parqueadero/tarifas',
      method: 'GET',
      summary: 'Lista las tarifas globales configuradas',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      responses: { '200': 'Lista de tarifas (Array<TarifaDTO>)' },
    },
    {
      path: '/api/parqueadero/tarifas',
      method: 'POST',
      summary: 'Crear o actualizar una tarifa global',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      requestBody: 'TarifaDTO',
      responses: { '200': 'Tarifa guardada (TarifaDTO)' },
    },
    {
      path: '/api/parqueadero/tarifas/{tipoVehiculo}/{tipoTarifa}',
      method: 'DELETE',
      summary: 'Eliminar una tarifa global específica (Admin)',
      tags: ['Parqueadero'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'tipoVehiculo',
          in: 'path',
          required: true,
          description: 'Tipo de vehículo (CARRO, MOTO, CAMION, BICICLETA)',
        },
        {
          name: 'tipoTarifa',
          in: 'path',
          required: true,
          description: 'Tipo de tarifa a eliminar',
        },
      ],
      responses: { '204': 'Tarifa eliminada' },
    },
    // --- Vehiculo Controller ---
    {
      path: '/api/vehiculos',
      method: 'GET',
      summary: 'Listar vehículos (opcionalmente filtrar por placa)',
      tags: ['Vehiculos'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'placa',
          in: 'query',
          required: false,
          description: 'Placa del vehículo para filtrar',
        },
      ],
      responses: { '200': 'Lista de vehículos (Array<VehiculoDTO>)' },
    },
    {
      path: '/api/vehiculos',
      method: 'POST',
      summary: 'Registrar nuevo vehículo',
      tags: ['Vehiculos'],
      security: 'Bearer Auth',
      requestBody: 'VehiculoDTO',
      responses: { '201': 'Vehículo creado' },
    },
    {
      path: '/api/vehiculos/{placa}',
      method: 'GET',
      summary: 'Obtener vehículo por placa',
      tags: ['Vehiculos'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'placa',
          in: 'path',
          required: true,
          description: 'Placa del vehículo',
        },
      ],
      responses: { '200': 'Detalle del vehículo (VehiculoDTO)' },
    },
    {
      path: '/api/vehiculos/{id}',
      method: 'PUT',
      summary: 'Actualizar vehículo',
      tags: ['Vehiculos'],
      security: 'Bearer Auth',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del vehículo',
        },
      ],
      requestBody: 'VehiculoDTO',
      responses: { '200': 'Vehículo actualizado' },
    },
    // --- Tarifa Controller (Entidad Directa) ---
    {
      path: '/api/tarifas',
      method: 'GET',
      summary: 'Listar todas las tarifas (Entidad)',
      tags: ['Tarifas'],
      security: 'Bearer Auth',
      responses: { '200': 'Lista de tarifas (Array<Tarifa>)' },
    },
    {
      path: '/api/tarifas',
      method: 'POST',
      summary: 'Guardar o actualizar tarifa (Entidad)',
      tags: ['Tarifas'],
      security: 'Bearer Auth',
      requestBody: 'Tarifa',
      responses: { '200': 'Tarifa guardada (Tarifa)' },
    },
  ];

  schemas = [
    {
      name: 'AuthRequest',
      properties: [
        { name: 'username', type: 'string' },
        { name: 'password', type: 'string' },
      ],
    },
    { name: 'AuthResponse', properties: [{ name: 'token', type: 'string' }] },
    {
      name: 'EntradaRequest',
      properties: [
        { name: 'placa', type: 'string' },
        { name: 'tipoVehiculo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        {
          name: 'tipoTarifa',
          type: 'string',
          enum: ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'],
        },
      ],
    },
    {
      name: 'SalidaRequest',
      properties: [
        { name: 'codigoTicket', type: 'string' },
        { name: 'placa', type: 'string' },
        { name: 'observaciones', type: 'string' },
      ],
    },
    {
      name: 'AgregarEspaciosRequest',
      properties: [
        { name: 'tipoVehiculo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        { name: 'cantidad', type: 'integer' },
        { name: 'tarifaBase', type: 'number' },
      ],
    },
    {
      name: 'EliminarEspaciosRequest',
      properties: [
        { name: 'tipoVehiculo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        { name: 'cantidad', type: 'integer' },
      ],
    },
    {
      name: 'TicketDTO',
      properties: [
        { name: 'codigo', type: 'string' },
        { name: 'placa', type: 'string' },
        { name: 'tipoVehiculo', type: 'string' },
        { name: 'codigoEspacio', type: 'string' },
        { name: 'horaEntrada', type: 'string (date-time)' },
        { name: 'tipoTarifa', type: 'string' },
        { name: 'estado', type: 'string' },
      ],
    },
    {
      name: 'EspacioDTO',
      properties: [
        { name: 'codigo', type: 'string' },
        { name: 'tipoVehiculo', type: 'string' },
        { name: 'estado', type: 'string' },
        { name: 'tarifaBase', type: 'number' },
      ],
    },
    {
      name: 'PagoResponse',
      properties: [
        { name: 'codigoTicket', type: 'string' },
        { name: 'horaEntrada', type: 'string (date-time)' },
        { name: 'horaSalida', type: 'string (date-time)' },
        { name: 'duracionHoras', type: 'integer' },
        { name: 'duracionMinutos', type: 'integer' },
        { name: 'valorBase', type: 'number' },
        { name: 'valorAdicional', type: 'number' },
        { name: 'descuento', type: 'number' },
        { name: 'valorTotal', type: 'number' },
        { name: 'mensaje', type: 'string' },
      ],
    },
    {
      name: 'EstadisticasDTO',
      properties: [
        { name: 'vehiculosActivos', type: 'integer' },
        { name: 'espaciosDisponibles', type: 'integer' },
        { name: 'espaciosOcupados', type: 'integer' },
        { name: 'ingresosHoy', type: 'number' },
        { name: 'ingresosMes', type: 'number' },
        { name: 'ticketsHoy', type: 'integer' },
        { name: 'ticketsMes', type: 'integer' },
      ],
    },
    {
      name: 'TarifaDTO',
      properties: [
        { name: 'tipoVehiculo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        {
          name: 'tipoTarifa',
          type: 'string',
          enum: ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'],
        },
        { name: 'valor', type: 'number' },
      ],
    },
    {
      name: 'VehiculoDTO',
      properties: [
        { name: 'id', type: 'integer (int64)' },
        { name: 'placa', type: 'string' },
        { name: 'tipo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        { name: 'marca', type: 'string' },
        { name: 'modelo', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'nombrePropietario', type: 'string' },
        { name: 'telefonoPropietario', type: 'string' },
        { name: 'fechaRegistro', type: 'string (date-time)' },
      ],
    },
    {
      name: 'Tarifa (Entidad)',
      properties: [
        { name: 'id', type: 'integer (int64)' },
        { name: 'tipoVehiculo', type: 'string', enum: ['CARRO', 'MOTO', 'CAMION', 'BICICLETA'] },
        {
          name: 'tipoTarifa',
          type: 'string',
          enum: ['POR_MINUTO', 'POR_HORA', 'POR_DIA', 'POR_MES', 'FRACCION'],
        },
        { name: 'valor', type: 'number' },
      ],
    },
  ];

  getMethodClass(method: string): string {
    switch (method) {
      case 'GET':
        return 'bg-primary text-white';
      case 'POST':
        return 'bg-success text-white';
      case 'PUT':
        return 'bg-warning text-dark';
      case 'DELETE':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
}
