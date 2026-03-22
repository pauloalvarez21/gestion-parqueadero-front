import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HistoryComponent } from './history';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment.development';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let httpMock: HttpTestingController;
  const expectedUrl = `${environment.baseUrl}/parqueadero/historial`;

  const mockHistory = [
    {
      id: 1,
      placaVehiculo: 'ABC123',
      codigoEspacio: 'A-01',
      horaEntrada: '2026-03-22T08:00:00',
      horaSalida: '2026-03-22T10:00:00',
      duracionMinutos: 120,
      valorTotal: 5000,
      creadoPor: 'admin',
      finalizadoPor: 'operador1',
      numeroFactura: 'FAC-001',
    },
    {
      id: 2,
      placaVehiculo: 'XYZ789',
      codigoEspacio: 'B-05',
      horaEntrada: '2026-03-22T09:00:00',
      horaSalida: '2026-03-22T11:30:00',
      duracionMinutos: 150,
      valorTotal: 6500,
      creadoPor: 'admin',
      finalizadoPor: 'admin',
      numeroFactura: 'FAC-002',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Handle the initial HTTP request from ngOnInit
    const req = httpMock.expectOne(expectedUrl);
    req.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty history array', () => {
    expect(component.history).toEqual([]);
  });

  it('should initialize with loading false after data loaded', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty error message', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should load history on init with mock data', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
    fixture.detectChanges();

    expect(component.history.length).toBe(2);
    expect(component.history).toEqual(mockHistory);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading history fails', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.history).toEqual([]);
    expect(component.errorMessage).toBe('No se pudo cargar el historial. Verifique la conexión y sus permisos.');
    expect(component.isLoading).toBeFalse();
  });

  it('should have correct history record structure after loading', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockHistory);
    fixture.detectChanges();

    const firstRecord = component.history[0];
    expect(firstRecord.id).toBe(1);
    expect(firstRecord.placaVehiculo).toBe('ABC123');
    expect(firstRecord.codigoEspacio).toBe('A-01');
    expect(firstRecord.duracionMinutos).toBe(120);
    expect(firstRecord.valorTotal).toBe(5000);
  });
});
