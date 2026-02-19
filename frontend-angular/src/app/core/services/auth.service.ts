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

  login(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    if (!this.user) {
      const stored = localStorage.getItem('user');
      this.user = stored ? JSON.parse(stored) : null;
    }
    return this.user;
  }

  isLogged(): boolean {
    return !!this.getUser();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }

  isPremium(): boolean {
    return this.getUser()?.role === 'PREMIUM';
  }
}
