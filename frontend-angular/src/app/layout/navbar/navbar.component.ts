import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  showLogin = false;
  showRegister = false;

  // Mostrar/ocultar contraseñas
  showLoginPassword = false;
  showRegisterPassword = false;

  form: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService) {

    // Login
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        this.passwordValidator
      ]]
    });

    // Registro
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validación de contraseña (mayúscula, minúscula, número, especial)
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  // Confirmar contraseña
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getters registro
  get hasMinLength(): boolean { return this.registerForm.get('password')?.value?.length >= 12; }
  get hasUpperCase(): boolean { return /[A-Z]/.test(this.registerForm.get('password')?.value); }
  get hasLowerCase(): boolean { return /[a-z]/.test(this.registerForm.get('password')?.value); }
  get hasNumber(): boolean { return /\d/.test(this.registerForm.get('password')?.value); }
  get hasSpecialChar(): boolean { return /[@$!%*?&]/.test(this.registerForm.get('password')?.value); }

  // Getters login
  get loginHasMinLength(): boolean { return this.form.get('password')?.value?.length >= 12; }
  get loginHasUpperCase(): boolean { return /[A-Z]/.test(this.form.get('password')?.value); }
  get loginHasLowerCase(): boolean { return /[a-z]/.test(this.form.get('password')?.value); }
  get loginHasNumber(): boolean { return /\d/.test(this.form.get('password')?.value); }
  get loginHasSpecialChar(): boolean { return /[@$!%*?&]/.test(this.form.get('password')?.value); }

  // Login
  toggleLogin() {
    this.showLogin = !this.showLogin;
    if (this.showLogin) this.showRegister = false;
  }

  login() {
    if (this.form.valid) {
      this.auth.login({
        id: 1,
        name: 'Usuario',
        role: 'FREE'
      });
      this.showLogin = false;
      this.form.reset();
    }
  }

  // Registro
  showRegisterModal() {
    this.showRegister = true;
    this.showLogin = false;
  }

  closeRegisterModal(event?: MouseEvent) {
    if (!event || (event.target as HTMLElement).classList.contains('modal-overlay') ||
        (event.target as HTMLElement).classList.contains('close-btn')) {
      this.showRegister = false;
      this.registerForm.reset();
    }
  }

  switchToLogin() {
    this.showRegister = false;
    this.showLogin = true;
    this.registerForm.reset();
  }

  onRegister() {
    if (this.registerForm.valid) {
      const userData = {
        email: this.registerForm.get('email')?.value,
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value
      };

      console.log('Registrando usuario:', userData);
      
      this.auth.login({
        id: Date.now(),
        name: userData.username,
        role: 'FREE'
      });

      this.showRegister = false;
      this.registerForm.reset();
      alert('¡Cuenta creada exitosamente! Bienvenido a ReadNow');
    }
  }
}
