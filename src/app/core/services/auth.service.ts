import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserResponse
} from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { STORAGE_KEYS, HTTP_STATUS, MESSAGES, HTTP_CONFIG } from '../../shared/constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/api/auth`;

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.API_URL}/register`, request)
            .pipe(
                retry({ count: 2, delay: HTTP_CONFIG.RETRY_DELAY }),
                tap(response => {
                    this.setUser(response);
                }),
                catchError(this.handleError)
            );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
            .pipe(
                retry({ count: 2, delay: HTTP_CONFIG.RETRY_DELAY }),
                tap(response => {
                    this.setToken(response.token);
                    this.isAuthenticatedSubject.next(true);

                    try {
                        const payload = this.decodeToken(response.token);
                    } catch (error) {
                    }
                }),
                catchError(this.handleError)
            );
    }

    private decodeToken(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }

    logout(): void {
        this.removeToken();
        this.removeUser();
        this.isAuthenticatedSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    isAuthenticated(): boolean {
        return this.hasToken();
    }

    setUser(user: UserResponse): void {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    getUser(): UserResponse | null {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    private setToken(token: string): void {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    private removeToken(): void {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    private removeUser(): void {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage: string = MESSAGES.ERRORS.UNKNOWN;

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            if (error.error?.message) {
                errorMessage = error.error.message;
            } else if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                errorMessage = MESSAGES.AUTH.INVALID_CREDENTIALS;
            } else if (error.status === HTTP_STATUS.CONFLICT) {
                errorMessage = MESSAGES.ERRORS.EMAIL_EXISTS;
            } else if (error.status === HTTP_STATUS.BAD_REQUEST) {
                errorMessage = MESSAGES.ERRORS.BAD_REQUEST;
            } else if (error.status === 0) {
                errorMessage = MESSAGES.ERRORS.SERVER_DOWN;
            } else {
                errorMessage = `Error del servidor: ${error.status}`;
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
