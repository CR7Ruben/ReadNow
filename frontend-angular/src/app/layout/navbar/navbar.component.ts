import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  showLoginPassword = false;
  showRegisterPassword = false;

  form: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService, private messageService: MessageService) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

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

  /* ================= VALIDADORES ================= */

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);

    return (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar)
      ? { weakPassword: true }
      : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  /* ================= FUERZA DE CONTRASEÑA ================= */

  get passwordScore(): number {
    let score = 0;

    if (this.hasMinLength) score++;
    if (this.hasUpperCase) score++;
    if (this.hasLowerCase) score++;
    if (this.hasNumber) score++;
    if (this.hasSpecialChar) score++;

    return score;
  }

  get passwordStrengthPercentage(): number {
    return (this.passwordScore / 5) * 100;
  }

  get passwordStrengthLabel(): string {
    switch (this.passwordScore) {
      case 0:
      case 1:
        return 'Débil';
      case 2:
      case 3:
        return 'Media';
      case 4:
      case 5:
        return 'Fuerte';
      default:
        return '';
    }
  }

  get strengthClass(): string {
    switch (this.passwordScore) {
      case 0:
      case 1:
        return 'weak';
      case 2:
      case 3:
        return 'medium';
      case 4:
      case 5:
        return 'strong';
      default:
        return '';
    }
  }

  /* ================= GETTERS REGISTRO ================= */

  get hasMinLength() {
    return this.registerForm.get('password')?.value?.length >= 12;
  }

  get hasUpperCase() {
    return /[A-Z]/.test(this.registerForm.get('password')?.value || '');
  }

  get hasLowerCase() {
    return /[a-z]/.test(this.registerForm.get('password')?.value || '');
  }

  get hasNumber() {
    return /\d/.test(this.registerForm.get('password')?.value || '');
  }

  get hasSpecialChar() {
    return /[@$!%*?&]/.test(this.registerForm.get('password')?.value || '');
  }

  /* ================= LOGIN ================= */

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.showRegister = false;
  }

  login() {
    if (this.form.valid) {
      this.auth.login({
        id: Date.now(),
        name: 'Usuario',
        role: 'FREE'
      });

      this.showLogin = false;
      this.showRegister = false;

      this.form.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido',
        detail: 'Has iniciado sesión correctamente',
        life: 2000
      });
    }
  }
  /* ================= REGISTRO ================= */

  showRegisterModal() {
    this.showRegister = true;
    this.showLogin = false;
  }

  closeRegisterModal(event?: MouseEvent) {
    if (!event ||
      (event.target as HTMLElement).classList.contains('modal-overlay') ||
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
        id: Date.now(),
        name: this.registerForm.get('username')?.value,
        role: 'FREE' as const
      };

      this.auth.login(userData);

      this.showRegister = false;
      this.showLogin = false;

      this.registerForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: '¡Cuenta creada exitosamente! Bienvenido a ReadNow 🚀',
        life: 2000
      });
    }
  }

}
