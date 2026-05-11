import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommandCatalogApiService } from './command-catalog-api.service';

describe('CommandCatalogApiService', () => {
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

  it('loads commands from the public Edge Function', () => {
    service.loadCommands().subscribe((commands) => {
      expect(commands.length).toBe(1);
      expect(commands[0].command).toBe('.bank balance');
    });

    const request = http.expectOne('https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog');
    request.flush({
      success: true,
      data: [{
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
      }],
      errors: [],
    });
  });

  it('falls back to local commands when the request fails', () => {
    service.loadCommands().subscribe((commands) => {
      expect(commands.length).toBeGreaterThan(0);
    });

    const request = http.expectOne('https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog');
    request.flush('error', { status: 500, statusText: 'Server Error' });
  });
});
