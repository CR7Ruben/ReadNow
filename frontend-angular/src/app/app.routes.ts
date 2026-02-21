import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { PremiumComponent } from './premium/premium.component';
import { premiumGuard } from './core/services/premium.guard';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },

  { path: 'categorias', component: CategoriesComponent },

  // Página pública para comprar premium
  { path: 'premium', component: PremiumComponent },

  // Detalle del libro 
  { path: 'book/:id', component: BookDetailComponent },

  // Ruta protegida de ejemplo
  {
    path: 'contenido-premium',
    component: PremiumComponent,
    canActivate: [premiumGuard]
  },

  // Cualquier ruta no válida
  { path: '**', redirectTo: '' }
];