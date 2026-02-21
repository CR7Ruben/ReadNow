import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../../core/services/books.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent {

  book: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService
  ) {}

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id'); // ❌ NO number()

  this.booksService.getBookById(id!).subscribe({
    next: (data) => {
      this.book = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error:', err);
      this.loading = false;
    }
  });
  }
}