import { ChangeDetectionStrategy, Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  errorMessage = signal('');
  loginError = signal('');
  hide = signal(true);
  isLoading = signal(false);

  readonly loginForm;
  private returnUrl: string = '/crypto';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/crypto';
  }

  updateErrorMessage(): void {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Ingresar email es obligatorio');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Email no válido');
    } else {
      this.errorMessage.set('');
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.loginError.set('');

      const loginRequest: LoginRequest = {
        email: this.email.value!,
        password: this.password.value!
      };

      this.authService.login(loginRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const userData = this.authService.getUser();
            if (!userData) {
              this.authService.setUser({
                id: 0,
                firstName: 'Usuario',
                lastName: '',
                email: this.email.value!
              });
            }

            this.isLoading.set(false);
            this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            this.loginError.set(error.message || 'Error al iniciar sesión');
            this.isLoading.set(false);
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  register(): void {
    this.router.navigate(['/dashboard/signup']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}