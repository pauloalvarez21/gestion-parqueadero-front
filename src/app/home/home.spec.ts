import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty actions when no role is set', () => {
    expect(component.actions).toEqual([]);
  });

  it('should have allActions defined', () => {
    expect(component['allActions']).toBeDefined();
    expect(component['allActions'].length).toBeGreaterThan(0);
  });

  it('should have correct action structure', () => {
    const allActions = component['allActions'];
    const firstAction = allActions[0];
    expect(firstAction).toBeDefined();
    expect(firstAction.title).toBeDefined();
    expect(firstAction.icon).toBeDefined();
    expect(firstAction.link).toBeDefined();
    expect(firstAction.allowedRoles).toBeDefined();
    expect(Array.isArray(firstAction.allowedRoles)).toBeTrue();
  });
});
