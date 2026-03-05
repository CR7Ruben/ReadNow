import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private API_URL = 'http://localhost:3000/api/books';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /* 📚 LISTA DE LIBROS */
  getBooks() {
    return this.http.get<any[]>(this.API_URL);
  }

  /* 📖 LIBRO POR ID */
  getBookById(id: string) {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.API_URL}/${id}`, { headers });
  }
}