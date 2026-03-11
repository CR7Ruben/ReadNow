import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const premiumGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLogged()) {
    router.navigate(['/']);
    return false;
  }
  if (!auth.isPremium() && !auth.isAdmin()) {
    router.navigate(['/premium']);
    return false;
  }
  return true;
};