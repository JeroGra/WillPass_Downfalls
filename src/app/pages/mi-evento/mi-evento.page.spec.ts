import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiEventoPage } from './mi-evento.page';

describe('MiEventoPage', () => {
  let component: MiEventoPage;
  let fixture: ComponentFixture<MiEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
