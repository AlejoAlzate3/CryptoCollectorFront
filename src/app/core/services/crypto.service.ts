import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  CryptoResponse, 
  CryptoPage, 
  CryptoStats, 
  SchedulerStatus 
} from '../models/crypto.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly API_URL = `${environment.apiUrl}/api/crypto`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista paginada de criptomonedas
   */
  listCryptos(
    query?: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'marketCapRank',
    dir: string = 'asc'
  ): Observable<CryptoPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('dir', dir);

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<CryptoPage>(`${this.API_URL}/list`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los detalles de una criptomoneda específica
   */
  getCryptoById(coinId: string): Observable<CryptoResponse> {
    return this.http.get<CryptoResponse>(`${this.API_URL}/${coinId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene estadísticas generales
   */
  getStats(): Observable<CryptoStats> {
    return this.http.get<CryptoStats>(`${this.API_URL}/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el estado del scheduler de sincronización
   */
  getSchedulerStatus(): Observable<SchedulerStatus> {
    return this.http.get<SchedulerStatus>(`${this.API_URL}/scheduler/status`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sincroniza manualmente las criptomonedas desde CoinGecko
   */
  syncCryptos(): Observable<any> {
    return this.http.post(`${this.API_URL}/sync`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 404) {
        errorMessage = 'Criptomoneda no encontrada';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
      } else {
        errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error en CryptoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
