import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIngresosComponent } from './modal-ingresos.component';

describe('ModalIngresosComponent', () => {
  let component: ModalIngresosComponent;
  let fixture: ComponentFixture<ModalIngresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIngresosComponent]
    });
    fixture = TestBed.createComponent(ModalIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
