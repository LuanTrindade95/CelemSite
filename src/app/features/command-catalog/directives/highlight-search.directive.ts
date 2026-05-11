import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[celemHighlightSearch]',
  standalone: true,
})
export class HighlightSearchDirective implements OnChanges {
  @Input({ alias: 'celemHighlightSearch', required: true }) public text = '';
  @Input() public searchTerm = '';

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnChanges(): void {
    const host = this.elementRef.nativeElement;
    const term = this.searchTerm.trim();
    this.renderer.setProperty(host, 'textContent', '');

    if (!term) {
      this.renderer.appendChild(host, this.renderer.createText(this.text));
      return;
    }

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matcher = new RegExp(`(${escaped})`, 'ig');
    const parts = this.text.split(matcher);

    for (const part of parts) {
      if (part.toLocaleLowerCase() === term.toLocaleLowerCase()) {
        const mark = this.renderer.createElement('mark');
        this.renderer.appendChild(mark, this.renderer.createText(part));
        this.renderer.appendChild(host, mark);
      } else {
        this.renderer.appendChild(host, this.renderer.createText(part));
      }
    }
  }
}
