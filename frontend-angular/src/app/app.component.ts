import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, ToastModule],
  template: `
  <p-toast></p-toast>
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
`
})
export class AppComponent {}
