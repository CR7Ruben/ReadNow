// src/app/pages/premium/premium.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Premium</h1><p>Contenido Premium para usuarios.</p>`
})
export class PremiumComponent {}
