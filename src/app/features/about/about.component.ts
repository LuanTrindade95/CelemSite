import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-about',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {}
