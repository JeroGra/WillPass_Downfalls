import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RendimientoEventosPage } from './rendimiento-eventos.page';

describe('RendimientoEventosPage', () => {
  let component: RendimientoEventosPage;
  let fixture: ComponentFixture<RendimientoEventosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RendimientoEventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
