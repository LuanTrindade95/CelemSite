import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-home',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
