import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { PremiumComponent } from './premium/premium.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },       // Inicio
  { path: 'categorias', component: CategoriesComponent },
  { path: 'premium', component: PremiumComponent },
  { path: '**', redirectTo: '' }                     // cualquier ruta desconocida va a inicio
];
