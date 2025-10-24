import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.models';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  readonly name = new FormControl('', [Validators.required]);
  readonly lastName = new FormControl('', [Validators.required]);
  readonly passwordConfirm = new FormControl('', [Validators.required]);

  errorMessage = signal('');
  registerError = signal('');
  registerSuccess = signal('');
  hide = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);

  readonly signupForm;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: this.email,
      password: this.password,
      name: this.name,
      lastName: this.lastName,
      passwordConfirm: this.passwordConfirm
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    merge(
      this.password.valueChanges.pipe(startWith(this.password.value)),
      this.passwordConfirm.valueChanges.pipe(startWith(this.passwordConfirm.value))
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncPasswordConfirmationError());
  }

  private syncPasswordConfirmationError(): void {
    const pw = this.password.value;
    const confirm = this.passwordConfirm.value;

    if (!pw || !confirm) {
      const errs = this.passwordConfirm.errors ? { ...this.passwordConfirm.errors } : null;
      if (errs && errs['passwordMismatch']) {
        delete errs['passwordMismatch'];
        const hasOther = Object.keys(errs).length > 0;
        this.passwordConfirm.setErrors(hasOther ? errs : null, { emitEvent: false });
      }
      return;
    }

    if (pw !== confirm) {
      const errs = this.passwordConfirm.errors ? { ...this.passwordConfirm.errors } : {};
      errs['passwordMismatch'] = true;
      this.passwordConfirm.setErrors(errs, { emitEvent: false });
    } else {
      const errs = this.passwordConfirm.errors ? { ...this.passwordConfirm.errors } : null;
      if (errs && errs['passwordMismatch']) {
        delete errs['passwordMismatch'];
        const hasOther = Object.keys(errs).length > 0;
        this.passwordConfirm.setErrors(hasOther ? errs : null, { emitEvent: false });
      } else if (!errs) {
        this.passwordConfirm.setErrors(null, { emitEvent: false });
      }
    }
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

  togglePasswordVisibility(event: MouseEvent, field: 'password' | 'confirm') {
    if (field === 'password') {
      this.hide.set(!this.hide());
    } else {
      this.hideConfirmPassword.set(!this.hideConfirmPassword());
    }
    event.stopPropagation();
  }

  register(): void {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.registerError.set('');
      this.registerSuccess.set('');

      const registerRequest: RegisterRequest = {
        firstName: this.name.value!,
        lastName: this.lastName.value!,
        email: this.email.value!,
        password: this.password.value!
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.isLoading.set(false);
          this.registerSuccess.set('¡Registro exitoso! Redirigiendo al login...');
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/dashboard/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.registerError.set(error.message || 'Error al registrarse');
          this.isLoading.set(false);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/dashboard/login']);
  }
}
