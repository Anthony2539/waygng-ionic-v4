import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyToastComponent } from './my-toast.component';

describe('MyToastComponent', () => {
  let component: MyToastComponent;
  let fixture: ComponentFixture<MyToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
