import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="premium-container">
      <h1>Plan Premium</h1>

      <div *ngIf="!auth.isPremium()" class="plan-card">
        <h2>Desbloquea todo el contenido</h2>
        <p>Acceso ilimitado a todos los libros.</p>

        <button (click)="upgrade()">Simular Compra</button>
      </div>

      <div *ngIf="auth.isPremium()" class="premium-active">
        <h2>🎉 Ya eres usuario Premium</h2>
        <p>Disfruta todo el contenido exclusivo.</p>
      </div>
    </div>
  `,
  styles: [`
    .premium-container {
      padding: 60px;
      text-align: center;
    }

    .plan-card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      max-width: 400px;
      margin: 0 auto;
    }

    button {
      margin-top: 20px;
      padding: 12px 25px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg,#667eea,#764ba2);
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      transform: scale(1.05);
    }

    .premium-active {
      margin-top: 40px;
      font-size: 1.2rem;
      color: green;
    }
  `]
})
export class PremiumComponent {

  constructor(public auth: AuthService, private messageService: MessageService) {}

  upgrade() {
  const user = this.auth.getUser();

  if (!user) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acceso requerido',
      detail: 'Debes iniciar sesión primero',
      life: 3000
    });
    return;
  }

  this.auth.login({
    ...user,
    role: 'PREMIUM'
  });

  this.messageService.add({
    severity: 'success',
    summary: '¡Felicidades!',
    detail: 'Ahora eres usuario PREMIUM 👑 de ReadNow',
    life: 4000
  });
}

}
