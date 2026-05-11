import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiEnvelope, CommandCatalogItem } from '../models/command-catalog.models';
import { LOCAL_COMMAND_CATALOG } from './local-command-catalog';

const COMMAND_CATALOG_ENDPOINT = 'https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog';

@Injectable({ providedIn: 'root' })
export class CommandCatalogApiService {
  private readonly http = inject(HttpClient);

  public loadCommands(): Observable<CommandCatalogItem[]> {
    return this.http.get<ApiEnvelope<CommandCatalogItem[]>>(COMMAND_CATALOG_ENDPOINT).pipe(
      map((response) => response.success ? response.data : LOCAL_COMMAND_CATALOG),
      catchError(() => of(LOCAL_COMMAND_CATALOG)),
    );
  }
}
