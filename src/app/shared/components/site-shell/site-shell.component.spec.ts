import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteShellComponent } from './site-shell.component';

describe('SiteShellComponent', () => {
  let fixture: ComponentFixture<SiteShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteShellComponent);
    fixture.detectChanges();
  });

  it('renders the Reino Sagrado de Celem brand', () => {
    expect(fixture.nativeElement.textContent).toContain('Reino Sagrado de Celem');
  });
});
