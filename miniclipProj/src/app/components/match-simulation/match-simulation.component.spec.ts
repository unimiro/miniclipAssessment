import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSimulationComponent } from './match-simulation.component';

describe('MatchSimulationComponent', () => {
  let component: MatchSimulationComponent;
  let fixture: ComponentFixture<MatchSimulationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchSimulationComponent]
    });
    fixture = TestBed.createComponent(MatchSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
