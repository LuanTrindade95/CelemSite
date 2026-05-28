import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelemBadgeComponent } from '../../shared/components/celem-badge/celem-badge.component';
import { CelemButtonComponent } from '../../shared/components/celem-button/celem-button.component';
import { CelemCardComponent } from '../../shared/components/celem-card/celem-card.component';
import { CelemMediaPlaceholderComponent } from '../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';
import { CelemSectionHeaderComponent } from '../../shared/components/celem-section-header/celem-section-header.component';

@Component({
  selector: 'celem-launcher',
  standalone: true,
  imports: [
    RouterLink,
    CelemBadgeComponent,
    CelemButtonComponent,
    CelemCardComponent,
    CelemMediaPlaceholderComponent,
    CelemSectionComponent,
    CelemSectionHeaderComponent,
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss',
})
export class LauncherComponent {
  protected syncFaqState(): void {
    return;
  }

  protected toggleFaq(event: Event): void {
    event.preventDefault();

    const summary = event.currentTarget;
    if (!(summary instanceof HTMLElement)) {
      return;
    }

    const details = summary.closest('details');
    if (!details) {
      return;
    }

    details.open = !details.open;
  }
}
