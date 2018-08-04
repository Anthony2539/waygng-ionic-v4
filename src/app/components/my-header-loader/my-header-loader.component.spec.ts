import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHeaderLoaderComponent } from './my-header-loader.component';

describe('MyHeaderLoaderComponent', () => {
  let component: MyHeaderLoaderComponent;
  let fixture: ComponentFixture<MyHeaderLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHeaderLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHeaderLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
