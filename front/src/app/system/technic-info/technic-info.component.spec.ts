import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicInfoComponent } from './technic-info.component';

describe('TechnicInfoComponent', () => {
  let component: TechnicInfoComponent;
  let fixture: ComponentFixture<TechnicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
