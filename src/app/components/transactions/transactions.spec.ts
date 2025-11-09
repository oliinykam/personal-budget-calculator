import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transactionsns } from './transactions';

describe('Transactionsns', () => {
  let component: Transactionsns;
  let fixture: ComponentFixture<Transactionsns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transactionsns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transactionsns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
