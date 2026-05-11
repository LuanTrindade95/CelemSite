import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightSearchDirective } from './highlight-search.directive';

@Component({
  standalone: true,
  imports: [HighlightSearchDirective],
  template: '<code [celemHighlightSearch]="value" [searchTerm]="term"></code>',
})
class HostComponent {
  public value = '.bank balance';
  public term = 'bank';
}

describe('HighlightSearchDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('wraps matching text in mark tags', () => {
    expect(fixture.nativeElement.querySelector('mark')?.textContent).toBe('bank');
  });
});
