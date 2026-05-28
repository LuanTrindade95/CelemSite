import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelemBadgeComponent } from '../../shared/components/celem-badge/celem-badge.component';
import { CelemButtonComponent } from '../../shared/components/celem-button/celem-button.component';
import { CelemMediaPlaceholderComponent } from '../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-launcher',
  standalone: true,
  imports: [
    RouterLink,
    CelemBadgeComponent,
    CelemButtonComponent,
    CelemMediaPlaceholderComponent,
    CelemSectionComponent,
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss',
})
export class LauncherComponent {}
