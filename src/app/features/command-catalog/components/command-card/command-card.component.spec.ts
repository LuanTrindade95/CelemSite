import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandCardComponent } from './command-card.component';

describe('CommandCardComponent', () => {
  let fixture: ComponentFixture<CommandCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandCardComponent);
    fixture.componentRef.setInput('command', {
      id: '1',
      projectSlug: 'celem-bank',
      projectName: 'CelemBank',
      category: 'Player',
      command: '.bank balance',
      aliases: ['.bank b'],
      permission: 'Player',
      description: 'Shows the balance.',
      usage: '.bank balance',
      examples: ['.bank balance'],
      language: 'en',
      sourcePath: 'CelemBank/docs/user/commands.md',
      sortOrder: 1,
    });
    fixture.detectChanges();
  });

  it('renders command metadata', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CelemBank');
    expect(text).toContain('.bank balance');
    expect(text).toContain('Shows the balance.');
  });
});
