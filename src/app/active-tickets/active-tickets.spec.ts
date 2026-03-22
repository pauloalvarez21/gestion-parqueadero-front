import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActiveTicketsComponent } from './active-tickets';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment.development';

describe('ActiveTicketsComponent', () => {
  let component: ActiveTicketsComponent;
  let fixture: ComponentFixture<ActiveTicketsComponent>;
  let httpMock: HttpTestingController;
  const expectedUrl = `${environment.baseUrl}/parqueadero/tickets/activos`;

  const mockTickets = [
    {
      id: 1,
      codigo: 'TKT-001',
      horaEntrada: '2026-03-22T08:00:00',
      tipoTarifa: 'NORMAL',
      estado: 'ACTIVO',
      vehiculo: {
        placa: 'ABC123',
        tipo: 'CARRO',
      },
      espacio: {
        codigo: 'A-01',
      },
      creadoPor: 'admin',
      finalizadoPor: '',
      numeroFactura: '',
    },
    {
      id: 2,
      codigo: 'TKT-002',
      horaEntrada: '2026-03-22T09:30:00',
      tipoTarifa: 'NORMAL',
      estado: 'ACTIVO',
      vehiculo: {
        placa: 'XYZ789',
        tipo: 'MOTO',
      },
      espacio: {
        codigo: 'B-05',
      },
      creadoPor: 'operador1',
      finalizadoPor: '',
      numeroFactura: '',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTicketsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTicketsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // Trigger ngOnInit

    // Handle the initial HTTP request from ngOnInit
    const req = httpMock.expectOne(expectedUrl);
    req.flush([]);
    fixture.detectChanges(); // Detect changes after flushing
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tickets array', () => {
    expect(component.tickets).toEqual([]);
  });

  it('should initialize with loading false after data loaded', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty error message', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when loading tickets fails', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ActiveTicketsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveTicketsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.tickets).toEqual([]);
    expect(component.errorMessage).toBe('No se pudieron cargar los tickets activos.');
    expect(component.isLoading).toBeFalse();
  });

  it('should load tickets with correct data', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ActiveTicketsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveTicketsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockTickets);
    fixture.detectChanges();

    expect(component.tickets.length).toBe(2);
    const firstTicket = component.tickets[0];
    expect(firstTicket.codigo).toBe('TKT-001');
    expect(firstTicket.vehiculo.placa).toBe('ABC123');
    expect(firstTicket.espacio.codigo).toBe('A-01');
    expect(firstTicket.estado).toBe('ACTIVO');
  });
});
