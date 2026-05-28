import { Component } from '@angular/core';
import { CelemSectionComponent } from '../../shared/components/celem-section/celem-section.component';

@Component({
  selector: 'celem-interface',
  standalone: true,
  imports: [CelemSectionComponent],
  templateUrl: './interface.component.html',
  styleUrl: './interface.component.scss',
})
export class InterfaceComponent {}
