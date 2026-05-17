import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiEnvelope, CommandCatalogItem } from '../models/command-catalog.models';
import { LOCAL_COMMAND_CATALOG } from './local-command-catalog';
import { SITE_API_ENDPOINTS } from '../../../shared/config/site-api.config';
import { SiteLanguageCode } from '../../../shared/i18n/site-language';

@Injectable({ providedIn: 'root' })
export class CommandCatalogApiService {
  private readonly http = inject(HttpClient);

  public loadCommands(languageCode: SiteLanguageCode): Observable<CommandCatalogItem[]> {
    const params = new HttpParams().set('language', languageCode);
    return this.http.get<ApiEnvelope<CommandCatalogItem[]>>(SITE_API_ENDPOINTS.siteCommandCatalog, {
      params,
      withCredentials: true,
    }).pipe(
      map((response) => response.success ? response.data : []),
      catchError(() => this.http.get<ApiEnvelope<CommandCatalogItem[]>>(SITE_API_ENDPOINTS.publicCommandCatalog, { params }).pipe(
        map((response) => response.success ? response.data : LOCAL_COMMAND_CATALOG),
        catchError(() => of(LOCAL_COMMAND_CATALOG)),
      )),
    );
  }
}
