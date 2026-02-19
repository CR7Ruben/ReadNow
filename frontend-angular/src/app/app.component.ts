import { Component } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    DashboardComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {}
