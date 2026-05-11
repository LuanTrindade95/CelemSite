import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommandCatalogComponent } from './command-catalog.component';
import { CommandCatalogApiService } from './services/command-catalog-api.service';

describe('CommandCatalogComponent', () => {
  let fixture: ComponentFixture<CommandCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandCatalogComponent],
      providers: [
        {
          provide: CommandCatalogApiService,
          useValue: {
            loadCommands: () => of([{
              id: '1',
              projectSlug: 'celem-bank',
              projectName: 'CelemBank',
              category: 'Player',
              command: '.bank balance',
              aliases: [],
              permission: 'Player',
              description: 'Shows the balance.',
              usage: '.bank balance',
              examples: ['.bank balance'],
              language: 'en',
              sourcePath: 'CelemBank/docs/user/commands.md',
              sortOrder: 1,
            }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandCatalogComponent);
    fixture.detectChanges();
  });

  it('renders loaded commands', () => {
    expect(fixture.nativeElement.textContent).toContain('.bank balance');
  });
});
