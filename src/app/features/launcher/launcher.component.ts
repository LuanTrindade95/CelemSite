import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-launcher',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss',
})
export class LauncherComponent {}
