import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { PremiumComponent } from './premium/premium.component';
import { premiumGuard } from './core/services/premium.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categorias', component: CategoriesComponent },

  // Página pública para comprar premium
  { path: 'premium', component: PremiumComponent },

  // Ruta protegida de ejemplo
  {
    path: 'contenido-premium',
    component: PremiumComponent,
    canActivate: [premiumGuard]
  },

  { path: '**', redirectTo: '' }
];
