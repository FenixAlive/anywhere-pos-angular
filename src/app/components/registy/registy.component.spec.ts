import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistyComponent } from './registy.component';

describe('RegistyComponent', () => {
  let component: RegistyComponent;
  let fixture: ComponentFixture<RegistyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
