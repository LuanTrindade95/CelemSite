import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelemButtonComponent } from '../../shared/components/celem-button/celem-button.component';
import { CelemCardComponent } from '../../shared/components/celem-card/celem-card.component';
import { CelemMediaPlaceholderComponent } from '../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';
import { CelemSectionHeaderComponent } from '../../shared/components/celem-section-header/celem-section-header.component';

@Component({
  selector: 'celem-home',
  standalone: true,
  imports: [
    RouterLink,
    CelemButtonComponent,
    CelemCardComponent,
    CelemMediaPlaceholderComponent,
    CelemSectionComponent,
    CelemSectionHeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
