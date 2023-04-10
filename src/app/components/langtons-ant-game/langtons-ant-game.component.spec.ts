import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangtonsAntGameComponent } from './langtons-ant-game.component';

describe('LangtonsAntGameComponent', () => {
  let component: LangtonsAntGameComponent;
  let fixture: ComponentFixture<LangtonsAntGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangtonsAntGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangtonsAntGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
