import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SneatUiTeamsComponent } from './teams.component';

describe('SneatUiTeamsComponent', () => {
  let component: SneatUiTeamsComponent;
  let fixture: ComponentFixture<SneatUiTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SneatUiTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SneatUiTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
