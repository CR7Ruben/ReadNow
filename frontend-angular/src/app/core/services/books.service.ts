import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private API_URL = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) {}

  // 📚 LISTA DE LIBROS
  getBooks() {
    return this.http.get<any[]>(this.API_URL);
  }

  // 📖 LIBRO POR ID
  getBookById(id: string) {
  return this.http.get<any>(`${this.API_URL}/${id}`);
  }
}