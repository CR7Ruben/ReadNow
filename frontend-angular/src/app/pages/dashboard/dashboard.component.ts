import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  books = [
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/10521258-L.jpg',
      title: 'El Misterio del Faro',
      author: 'Autor Desconocido'
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/10958374-L.jpg',
      title: 'SUEÑOS de ACERO',
      author: 'Autor Desconocido'
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/11153220-L.jpg',
      title: 'La CIUDAD PERDIDA',
      author: 'Autor Desconocido'
    },
    {
      thumbnail: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
      title: 'Romance en París',
      author: 'Autor Desconocido'
    }
  ];

  featuredBooks = [
    {
      title: 'El Misterio del Faro',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'SUEÑOS de ACERO',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'La CIUDAD PERDIDA',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Romance en París',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
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

}