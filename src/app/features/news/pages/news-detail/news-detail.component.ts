import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-news-detail',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent {}
