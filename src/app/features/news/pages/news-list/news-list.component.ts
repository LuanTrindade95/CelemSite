import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-news-list',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {}
