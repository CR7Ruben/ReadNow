import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  books = [
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/10521258-L.jpg',
      title: 'El Misterio del Faro',
      author: 'Autor Desconocido',
      premium: false
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/10958374-L.jpg',
      title: 'SUEÑOS de ACERO',
      author: 'Autor Desconocido',
      premium: true
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/11153220-L.jpg',
      title: 'La CIUDAD PERDIDA',
      author: 'Autor Desconocido',
      premium: true
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
      title: 'Romance en París',
      author: 'Autor Desconocido',
      premium: false
    }
  ];

  recommendedBooks = [
    { title: 'El Jardín Secreto' },
    { title: 'Océano Infinito' },
    { title: 'Noche Estrellada' },
    { title: 'Viaje al Centro' }
  ];

  popularBooks = [
    { title: 'El Último Deseo' },
    { title: 'Luz de Luna' },
    { title: 'Torre de Marfil' },
    { title: 'Vientos del Norte' }
  ];

  goToBook(book: any) {
    if (book.premium && !this.auth.isPremium()) {
      this.router.navigate(['/premium']);
    } else {
      console.log('Abrir libro...');
    }
  }
}
