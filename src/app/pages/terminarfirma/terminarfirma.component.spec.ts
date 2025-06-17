import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminarfirmaComponent } from './terminarfirma.component';

describe('TerminarfirmaComponent', () => {
  let component: TerminarfirmaComponent;
  let fixture: ComponentFixture<TerminarfirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminarfirmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminarfirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
