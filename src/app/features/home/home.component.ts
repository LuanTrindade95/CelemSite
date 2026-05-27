import { Component } from '@angular/core';
import { CelemButtonComponent } from '../../shared/components/celem-button/celem-button.component';
import { CelemMediaPlaceholderComponent } from '../../shared/components/celem-media-placeholder/celem-media-placeholder.component';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-home',
  standalone: true,
  imports: [CelemButtonComponent, CelemMediaPlaceholderComponent, CelemSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
