import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartFourComponent } from './bar-chart-four.component';

describe('BarChartFourComponent', () => {
  let component: BarChartFourComponent;
  let fixture: ComponentFixture<BarChartFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
