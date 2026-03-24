import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
  description?: string;
  premium?: boolean;
  downloadCount?: number;
  subjects?: string[];
}

export interface ReadingHistoryItem {
  id: number;
  id_usuario: number;
  id_libro: string;
  fecha_lectura: string;
  book_details?: Book;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingHistoryService {
  private apiUrl = 'http://localhost:5036/api';

  constructor(private http: HttpClient) {}

  getReadingHistory(): Observable<ReadingHistoryItem[]> {
    return this.http.get<ReadingHistoryItem[]>(`${this.apiUrl}/books/read/historial`);
  }

  addToReadingHistory(bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/books/read/${bookId}`, {});
  }

  getBookDetails(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${bookId}`);
  }
}
