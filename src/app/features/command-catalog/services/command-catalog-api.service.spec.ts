import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommandCatalogApiService } from './command-catalog-api.service';

describe('CommandCatalogApiService', () => {
  const languageCode = 'english';
  let service: CommandCatalogApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CommandCatalogApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads commands from the protected site Edge Function', () => {
    service.loadCommands(languageCode).subscribe((commands) => {
      expect(commands.length).toBe(1);
      expect(commands[0].command).toBe('.bank balance');
    });

    const request = http.expectOne((candidate) =>
      candidate.url === 'https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/site-command-catalog'
      && candidate.params.get('language') === languageCode
      && candidate.withCredentials);
    request.flush({
      success: true,
      data: [{
        id: '1',
        projectSlug: 'celem-bank',
        projectName: 'CelemBank',
        category: 'player',
        command: '.bank balance',
        aliases: [],
        permission: 'Player',
        description: 'Shows the balance.',
        usage: '.bank balance',
        examples: ['.bank balance'],
        language: 'english',
        sourcePath: 'CelemBank/docs/user/commands.md',
        sortOrder: 1,
      }],
      errors: [],
    });
  });

  it('falls back to local commands when both API requests fail', () => {
    service.loadCommands(languageCode).subscribe((commands) => {
      expect(commands.length).toBeGreaterThan(0);
    });

    const protectedRequest = http.expectOne((candidate) =>
      candidate.url === 'https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/site-command-catalog'
      && candidate.params.get('language') === languageCode);
    protectedRequest.flush('error', { status: 500, statusText: 'Server Error' });

    const publicRequest = http.expectOne((candidate) =>
      candidate.url === 'https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog'
      && candidate.params.get('language') === languageCode);
    publicRequest.flush('error', { status: 500, statusText: 'Server Error' });
  });
});
