import { Component, Input } from '@angular/core';

export type CelemSectionTone = 'default' | 'subtle';

@Component({
  selector: 'celem-section',
  standalone: true,
  templateUrl: './celem-section.component.html',
  styleUrl: './celem-section.component.scss',
})
export class CelemSectionComponent {
  @Input() public tone: CelemSectionTone = 'default';
}
