import { Component, Input } from '@angular/core';

@Component({
  selector: 'celem-section-header',
  standalone: true,
  templateUrl: './celem-section-header.component.html',
  styleUrl: './celem-section-header.component.scss',
})
export class CelemSectionHeaderComponent {
  @Input() public eyebrow = '';
  @Input({ required: true }) public title = '';
  @Input() public subtitle = '';
}
