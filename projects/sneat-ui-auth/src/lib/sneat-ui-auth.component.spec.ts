import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SneatUiAuthComponent } from './sneat-ui-auth.component';

describe('SneatUiAuthComponent', () => {
  let component: SneatUiAuthComponent;
  let fixture: ComponentFixture<SneatUiAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SneatUiAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SneatUiAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
