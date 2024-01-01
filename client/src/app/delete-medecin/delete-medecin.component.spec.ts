import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMedecinComponent } from './delete-medecin.component';

describe('DeleteMedecinComponent', () => {
  let component: DeleteMedecinComponent;
  let fixture: ComponentFixture<DeleteMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMedecinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
