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

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.textContent?.trim()).toMatch(/Player|Jogador/);
    expect(permissionPill.classList.contains('admin')).toBeFalse();
  });

  it('lets audience player win over isAdminVariant true', () => {
    setCommand({
      audience: 'player',
      isAdminVariant: true,
    });
    fixture.detectChanges();

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.classList.contains('admin')).toBeFalse();
    expect(permissionPill.textContent?.trim()).not.toBe('Admin');
  });

  it('lets audience player win over variantLabel admin', () => {
    setCommand({
      audience: 'player',
      variantLabel: 'Admin',
    });
    fixture.detectChanges();

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.classList.contains('admin')).toBeFalse();
    expect(permissionPill.textContent?.trim()).not.toBe('Admin');
  });

  it('lets audience player win over category admin', () => {
    setCommand({
      audience: 'player',
      category: 'admin',
    });
    fixture.detectChanges();

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.classList.contains('admin')).toBeFalse();
    expect(permissionPill.textContent?.trim()).not.toBe('Admin');
  });

  it('renders an admin class and badge for admin variants', () => {
    setCommand({
      audience: 'admin',
      variantLabel: 'Admin',
      category: 'admin',
      permission: 'Admin',
    });
    fixture.detectChanges();

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.classList.contains('admin')).toBeTrue();
    expect(permissionPill.textContent?.trim()).toBe('Admin');
  });

  it('keeps legacy payloads without audience compatible', () => {
    setCommand({
      category: 'admin',
      permission: 'Admin',
    });
    fixture.detectChanges();

    const permissionPill = fixture.nativeElement.querySelector('.permission') as HTMLElement;
    expect(permissionPill.classList.contains('admin')).toBeTrue();
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
