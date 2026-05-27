import { Component, Input } from '@angular/core';

export type CelemBadgeTone = 'neutral' | 'gold' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'celem-badge',
  standalone: true,
  templateUrl: './celem-badge.component.html',
  styleUrl: './celem-badge.component.scss',
})
export class CelemBadgeComponent {
  @Input() public tone: CelemBadgeTone = 'neutral';
}
