import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VehiclesComponent } from './vehicles';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

describe('VehiclesComponent', () => {
  let component: VehiclesComponent;
  let fixture: ComponentFixture<VehiclesComponent>;
  let httpMock: HttpTestingController;
  const expectedUrl = `${environment.baseUrl}/vehiculos`;

  const mockVehicles = [
    {
      id: 1,
      placa: 'ABC123',
      tipo: 'CARRO',
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Rojo',
      nombrePropietario: 'Juan Pérez',
      telefonoPropietario: '3001234567',
    },
    {
      id: 2,
      placa: 'XYZ789',
      tipo: 'MOTO',
      marca: 'Yamaha',
      modelo: 'MT-03',
      color: 'Azul',
      nombrePropietario: 'María García',
      telefonoPropietario: '3109876543',
    },
    {
      id: 3,
      placa: 'DEF456',
      tipo: 'BICICLETA',
      marca: 'GW',
      modelo: 'Urbana',
      color: 'Negro',
      nombrePropietario: 'Carlos López',
      telefonoPropietario: '3151112233',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesComponent, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesComponent);
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

  it('should initialize with empty vehicles array', () => {
    expect(component.vehicles).toEqual([]);
  });

  it('should initialize with loading false after data loaded', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty error and success messages', () => {
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should initialize with empty searchPlaca', () => {
    expect(component.searchPlaca).toBe('');
  });

  it('should initialize newVehicle with default values', () => {
    expect(component.newVehicle).toEqual({
      placa: '',
      tipo: 'CARRO',
    });
  });

  it('should load vehicles with mock data', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VehiclesComponent, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicles);
    fixture.detectChanges();

    expect(component.vehicles.length).toBe(3);
    expect(component.vehicles).toEqual(mockVehicles);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading vehicles fails', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VehiclesComponent, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.vehicles).toEqual([]);
    expect(component.errorMessage).toBe('No se pudieron cargar los vehículos.');
    expect(component.isLoading).toBeFalse();
  });

  it('should return paginated vehicles correctly', () => {
    component.vehicles = mockVehicles;
    component.currentPage = 1;
    component.pageSize = 2;

    const paginated = component.paginatedVehicles;
    expect(paginated.length).toBe(2);
    expect(paginated[0].placa).toBe('ABC123');
    expect(paginated[1].placa).toBe('XYZ789');
  });

  it('should calculate total pages correctly', () => {
    component.vehicles = mockVehicles;
    component.pageSize = 2;

    expect(component.totalPages).toBe(2);
  });

  it('should set page correctly', () => {
    component.setPage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should edit vehicle and copy its data to newVehicle', () => {
    const vehicleToEdit = mockVehicles[0];
    component.editVehicle(vehicleToEdit);

    expect(component.newVehicle).toEqual({ ...vehicleToEdit });
  });

  it('should uppercase placa in onPlacaChange', () => {
    component.onPlacaChange('abc');
    expect(component.newVehicle.placa).toBe('ABC');
  });

  it('should not fetch vehicle when placa has less than 6 characters', () => {
    component.onPlacaChange('ABC');
    httpMock.expectNone(`${expectedUrl}/ABC`);
  });

  it('should add new vehicle successfully (POST)', fakeAsync(() => {
    const newVehicle = {
      placa: 'NEW001',
      tipo: 'CARRO',
      marca: 'Honda',
    };

    component.newVehicle = newVehicle;
    component.addVehicle();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newVehicle);

    // Handle the subsequent loadVehicles() call
    const loadReq = httpMock.expectOne(expectedUrl);
    loadReq.flush([]);

    tick(3000);
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
  }));

  it('should update existing vehicle successfully (PUT)', fakeAsync(() => {
    const vehicleToUpdate = { ...mockVehicles[0], marca: 'Updated' };

    component.newVehicle = vehicleToUpdate;
    component.addVehicle();

    const req = httpMock.expectOne(`${expectedUrl}/${vehicleToUpdate.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(vehicleToUpdate);

    // Handle the subsequent loadVehicles() call
    const loadReq = httpMock.expectOne(expectedUrl);
    loadReq.flush([]);

    tick(3000);
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when adding vehicle fails', () => {
    component.newVehicle = { placa: 'NEW001', tipo: 'CARRO' };
    component.addVehicle();

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toContain('Error al guardar el vehículo');
  });

  it('should reset newVehicle after successful add', fakeAsync(() => {
    component.newVehicle = { placa: 'NEW001', tipo: 'MOTO' };
    component.addVehicle();

    const req = httpMock.expectOne(expectedUrl);
    req.flush({ placa: 'NEW001', tipo: 'MOTO' });

    // Handle the subsequent loadVehicles() call
    const loadReq = httpMock.expectOne(expectedUrl);
    loadReq.flush([]);

    tick(3000);
    fixture.detectChanges();

    expect(component.newVehicle).toEqual({ placa: '', tipo: 'CARRO' });
  }));
});
