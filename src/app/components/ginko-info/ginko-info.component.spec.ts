import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GinkoInfoComponent } from './ginko-info.component';

describe('GinkoInfoComponent', () => {
  let component: GinkoInfoComponent;
  let fixture: ComponentFixture<GinkoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GinkoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GinkoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
