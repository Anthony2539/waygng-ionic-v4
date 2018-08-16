import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifPage } from './tarif.page';

describe('TarifPage', () => {
  let component: TarifPage;
  let fixture: ComponentFixture<TarifPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
