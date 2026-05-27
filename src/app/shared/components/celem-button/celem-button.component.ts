import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type CelemButtonVariant = 'primary' | 'secondary' | 'ghost';
export type CelemButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'celem-button',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './celem-button.component.html',
  styleUrl: './celem-button.component.scss',
})
export class CelemButtonComponent {
  @Input() public variant: CelemButtonVariant = 'primary';
  @Input() public size: CelemButtonSize = 'md';
  @Input() public href = '';
  @Input() public disabled = false;

  @Output() public readonly pressed = new EventEmitter<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed.emit(event);
  }
}
