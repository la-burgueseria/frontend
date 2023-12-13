import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuentasComponent } from './modal-cuentas.component';

describe('ModalCuentasComponent', () => {
  let component: ModalCuentasComponent;
  let fixture: ComponentFixture<ModalCuentasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCuentasComponent]
    });
    fixture = TestBed.createComponent(ModalCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
