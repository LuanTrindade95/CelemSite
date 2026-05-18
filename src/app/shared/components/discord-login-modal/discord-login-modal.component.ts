import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteI18nService } from '../../services/site-i18n.service';

@Component({
  selector: 'celem-discord-login-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './discord-login-modal.component.html',
  styleUrl: './discord-login-modal.component.scss',
})
export class DiscordLoginModalComponent {
  @Input({ required: true }) public rememberSession = true;
  @Input({ required: true }) public isBusy = false;

  @Output() public readonly rememberSessionChange = new EventEmitter<boolean>();
  @Output() public readonly confirmLogin = new EventEmitter<void>();
  @Output() public readonly cancelLogin = new EventEmitter<void>();

  protected readonly text = (key: Parameters<SiteI18nService['text']>[0]) => this.i18n.text(key);

  public constructor(private readonly i18n: SiteI18nService) {}

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isBusy) {
      return;
    }

    this.cancelLogin.emit();
  }

  protected closeFromBackdrop(): void {
    if (this.isBusy) {
      return;
    }

    this.cancelLogin.emit();
  }

  protected stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected updateRememberSession(checked: boolean): void {
    this.rememberSessionChange.emit(checked);
  }

  protected confirm(): void {
    if (this.isBusy) {
      return;
    }

    this.confirmLogin.emit();
  }
}
