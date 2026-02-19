import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  role: 'FREE' | 'PREMIUM' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User | null = null;

  constructor() {
    const stored = localStorage.getItem('user');
    this.user = stored ? JSON.parse(stored) : null;
  }

  login(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    return this.user;
  }

  isLogged(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  isPremium(): boolean {
    return this.user?.role === 'PREMIUM';
  }

  upgradeToPremium() {
    if (this.user) {
      this.user.role = 'PREMIUM';
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
}
