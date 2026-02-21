import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BooksService } from '../../core/services/books.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // 👈 ngIf + ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // 👈 ver problema 2
})
export class DashboardComponent {

  books: any[] = [];
  recommendedBooks: any[] = [];
  popularBooks: any[] = [];

  constructor(
    private bookService: BooksService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.recommendedBooks = data.slice(0, 5);
      this.popularBooks = data.slice(5, 10);
    });
  }

  goToBook(book: any) {
  console.log('Libro clickeado:', book);

  if (book.premium && !this.auth.isPremium()) {
    this.router.navigate(['/premium']);
  } else {
    this.router.navigate(['/book', book.id]);
  }
}
}