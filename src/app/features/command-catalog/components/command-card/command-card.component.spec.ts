import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandCardComponent } from './command-card.component';
import { CommandCatalogItem } from '../../models/command-catalog.models';

describe('CommandCardComponent', () => {
  let fixture: ComponentFixture<CommandCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandCardComponent);
    setCommand();
    fixture.detectChanges();
  });

  it('renders command metadata', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CelemBank');
    expect(text).toContain('.bank balance');
    expect(text).toContain('Shows the balance.');
  });

  it('uses audience variant labels instead of mixed permission text for the audience pill', () => {
    setCommand({
      audience: 'player',
      variantLabel: 'Player',
      isAdminVariant: false,
      category: 'Player',
      permission: 'Player; optional target requires admin',
    });
    fixture.detectChanges();

    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(audienceBadge.textContent?.trim()).toMatch(/Player|Jogador/);
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeFalse();
    expect(fixture.nativeElement.textContent).not.toContain('optional target requires admin');
  });

  it('lets audience player win over isAdminVariant true', () => {
    setCommand({
      audience: 'player',
      isAdminVariant: true,
    });
    fixture.detectChanges();

    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeFalse();
    expect(audienceBadge.textContent?.trim()).not.toBe('Admin');
  });

  it('lets audience player win over variantLabel admin', () => {
    setCommand({
      audience: 'player',
      variantLabel: 'Admin',
    });
    fixture.detectChanges();

    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeFalse();
    expect(audienceBadge.textContent?.trim()).not.toBe('Admin');
  });

  it('lets audience player win over category admin', () => {
    setCommand({
      audience: 'player',
      category: 'admin',
    });
    fixture.detectChanges();

    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeFalse();
    expect(audienceBadge.textContent?.trim()).not.toBe('Admin');
  });

  it('renders an admin class and badge for admin variants', () => {
    setCommand({
      audience: 'admin',
      variantLabel: 'Admin',
      category: 'admin',
      permission: 'Admin',
    });
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.command-card') as HTMLElement;
    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(card.classList.contains('command-card--admin')).toBeTrue();
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeTrue();
    expect(audienceBadge.textContent?.trim()).toBe('Admin');
  });

  it('keeps legacy payloads without audience compatible', () => {
    setCommand({
      category: 'admin',
      permission: 'Admin',
    });
    fixture.detectChanges();

    const audienceBadge = fixture.nativeElement.querySelector('.audience-badge') as HTMLElement;
    expect(audienceBadge.classList.contains('audience-badge--admin')).toBeTrue();
  });

  it('applies the admin visual class only to admin variants', () => {
    let card = fixture.nativeElement.querySelector('.command-card') as HTMLElement;
    expect(card.classList.contains('command-card--admin')).toBeFalse();
    expect(card.classList.contains('command-card--player')).toBeTrue();

    setCommand({
      audience: 'admin',
      variantLabel: 'Admin',
      category: 'admin',
    });
    fixture.detectChanges();

    card = fixture.nativeElement.querySelector('.command-card') as HTMLElement;
    expect(card.classList.contains('command-card--admin')).toBeTrue();
    expect(card.classList.contains('command-card--player')).toBeFalse();
  });

  it('copies the usage for the current variant', async () => {
    const writeText = jasmine.createSpy('writeText').and.resolveTo();
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    setCommand({
      audience: 'admin',
      command: '.bank balance',
      usage: '.bank balance <player>',
    });
    fixture.detectChanges();

    await fixture.componentInstance.copyPrimaryUsage();

    expect(writeText).toHaveBeenCalledOnceWith('.bank balance <player>');
  });

  function setCommand(partial: Partial<CommandCatalogItem> = {}): void {
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
      ...partial,
    });
  }
});
