import { Component, Input } from '@angular/core';

export type CelemMediaRatio = '16:9' | '4:3' | '1:1';

@Component({
  selector: 'celem-media-placeholder',
  standalone: true,
  templateUrl: './celem-media-placeholder.component.html',
  styleUrl: './celem-media-placeholder.component.scss',
})
export class CelemMediaPlaceholderComponent {
  @Input() public ratio: CelemMediaRatio = '16:9';
  @Input() public src = '';
  @Input() public alt = '';
  @Input() public label = 'Media pending';
}
