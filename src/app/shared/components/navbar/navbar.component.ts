import { ChangeDetectionStrategy, Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../core/models/auth.models';
import { APP_ROUTES } from '../../constants/app.constants';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    user = signal<UserResponse | null>(null);
    isAuthenticated = signal(false);

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.isAuthenticated.set(this.authService.isAuthenticated());

        const userData = this.authService.getUser();
        if (userData) {
            this.user.set(userData);
        }

        this.authService.isAuthenticated$
            .pipe(takeUntil(this.destroy$))
            .subscribe(authenticated => {
                this.isAuthenticated.set(authenticated);
                if (authenticated) {
                    this.user.set(this.authService.getUser());
                } else {
                    this.user.set(null);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate([APP_ROUTES.LOGIN]);
    }

    getUserInitials(): string {
        const user = this.user();
        if (!user) return '';

        const firstInitial = user.firstName.charAt(0).toUpperCase();
        const lastInitial = user.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    getUserFullName(): string {
        const user = this.user();
        if (!user) return '';
        return `${user.firstName} ${user.lastName}`;
    }
}
