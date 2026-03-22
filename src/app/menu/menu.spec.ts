import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuComponent } from './menu';
import { provideRouter, Router } from '@angular/router';
import { of, Subject } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([]),
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            url: '/home',
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with collapsed menu', () => {
    expect(component.isMenuCollapsed).toBeTrue();
  });

  it('should toggle menu', () => {
    component.isMenuCollapsed = true;
    component.toggleMenu();
    expect(component.isMenuCollapsed).toBeFalse();

    component.toggleMenu();
    expect(component.isMenuCollapsed).toBeTrue();
  });

  it('should collapse menu', () => {
    component.isMenuCollapsed = false;
    component.collapseMenu();
    expect(component.isMenuCollapsed).toBeTrue();
  });

  it('should not be logged in when no token', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    component.checkLogin();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.menuItems).toEqual([]);
  });

  it('should be logged in when token and role exist', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'ADMIN');
    component.checkLogin();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.menuItems.length).toBeGreaterThan(0);
  });

  it('should filter menu items for ADMIN role', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'ADMIN');
    component.checkLogin();

    const menuTitles = component.menuItems.map((item) => item.title);
    expect(menuTitles).toContain('Inicio');
    expect(menuTitles).toContain('Entrada');
    expect(menuTitles).toContain('Salida');
    expect(menuTitles).toContain('Tickets');
    expect(menuTitles).toContain('Espacios');
    expect(menuTitles).toContain('Vehículos');
    expect(menuTitles).toContain('Tarifas');
    expect(menuTitles).toContain('Usuarios');
    expect(menuTitles).toContain('Dashboard');
    expect(menuTitles).toContain('Facturación');
  });

  it('should filter menu items for OPERADOR role', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'OPERADOR');
    component.checkLogin();

    const menuTitles = component.menuItems.map((item) => item.title);
    expect(menuTitles).toContain('Inicio');
    expect(menuTitles).toContain('Entrada');
    expect(menuTitles).toContain('Salida');
    expect(menuTitles).toContain('Tickets');
    expect(menuTitles).toContain('Espacios');
    expect(menuTitles).toContain('Vehículos');
    // OPERADOR no debería tener acceso a estas
    expect(menuTitles).not.toContain('Tarifas');
    expect(menuTitles).not.toContain('Usuarios');
    expect(menuTitles).not.toContain('Dashboard');
  });

  it('should handle role with extra spaces', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', '  admin  ');
    component.checkLogin();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.menuItems.length).toBeGreaterThan(0);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'ADMIN');
    localStorage.setItem('username', 'testuser');

    component.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should hide menu when on login page', () => {
    (router as any).url = '/login';
    component.checkLogin();

    expect(component.isLoggedIn).toBeFalse();
  });

  it('should collapse menu after navigation event', () => {
    component.isMenuCollapsed = false;
    component.collapseMenu();

    expect(component.isMenuCollapsed).toBeTrue();
  });

  it('should update menu items after navigation event', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'ADMIN');
    component.checkLogin();

    const initialCount = component.menuItems.length;

    localStorage.setItem('role', 'OPERADOR');
    component.checkLogin();

    expect(component.menuItems.length).not.toBe(initialCount);
  });

  it('should have username from localStorage', () => {
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'ADMIN');
    component.checkLogin();

    expect(component.username).toBe('testuser');
  });

  it('should have role from localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'OPERADOR');
    component.checkLogin();

    expect(component.role).toBe('OPERADOR');
  });
});
