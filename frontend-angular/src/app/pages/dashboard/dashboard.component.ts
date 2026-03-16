import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BooksService } from '../../core/services/books.service';
import { AuthService, SubscriptionInfo } from '../../core/services/auth.service';
import { LoggerService } from '../../core/services/logger.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  books: any[] = [];

  carouselBooks: any[] = [];

  recommendedBooks: any[] = [];
  popularBooks: any[] = [];

  searchQuery = '';
  searchResults: any[] = [];
  subscriptionInfo: SubscriptionInfo | null = null;

  startIndex = 0;
  visibleBooks = 5;

  constructor(
    private bookService: BooksService,
    private router: Router,
    public auth: AuthService,
    private logger: LoggerService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.logger.info('DashboardComponent cargado');

    this.bookService.getBooks().subscribe({

      next: (data) => {

        this.logger.log('Libros cargados correctamente', data);

        this.books = data;

      // Carrusel: primeros 5 libros
        this.carouselBooks = this.books.slice(0, this.visibleBooks);

      // Recomendados: primeros 5
        this.recommendedBooks = data.slice(0, 5);

      // Populares: siguientes 5
        this.popularBooks = data.slice(5, 10);
        this.logger.info('Secciones de libros inicializadas');
      },
      error: (error) => {
        this.logger.error('Error al obtener libros del servicio', error);
      }

    });

    // Cargar información del plan del usuario
    this.loadSubscriptionInfo();
  }

  /* 📊 CARGAR INFORMACIÓN DEL PLAN */
  loadSubscriptionInfo() {
    this.auth.getSubscription().subscribe({
      next: (info) => {
        this.subscriptionInfo = info;
        this.forceUpdate();
      },
      error: (error) => {
        console.error('Error cargando información del plan:', error);
        this.subscriptionInfo = null;
        this.forceUpdate();
      }
    });
  }

  /* 🔎 BUSCAR LIBROS */
  searchBooks() {
    console.log('🔍 Iniciando búsqueda con query:', this.searchQuery);
    
    if (!this.searchQuery.trim()) {
      console.log('🔍 Query vacío, limpiando resultados');
      this.searchResults = [];
      this.forceUpdate();
      return;
    }

    console.log('🔍 Llamando a bookService.searchBooks con:', this.searchQuery);
    
    this.bookService.searchBooks(this.searchQuery)
      .subscribe({
        next: (data) => {
          console.log('🔍 Respuesta recibida:', data);
          this.searchResults = data || [];
          console.log('🔥 Datos asignados. Length:', this.searchResults.length);
          console.log('🔥 Resultados completos:', this.searchResults);
          // Forzar actualización con NgZone
          this.forceUpdate();
        },
        error: (error) => {
          console.error('❌ Error en búsqueda:', error);
          this.searchResults = [];
          this.forceUpdate();
        }
      });
  }

  /* 🔄 FORZAR ACTUALIZACIÓN CON NGZONE */
  forceUpdate() {
    this.ngZone.run(() => {
      this.cdr.detectChanges();
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }

  /*  LIMPIAR BÚSQUEDA */
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.forceUpdate();
  }

  // Carrusel
  nextBooks() {

    if (this.startIndex + this.visibleBooks < this.books.length) {

      this.startIndex++;

      this.carouselBooks = this.books.slice(
        this.startIndex,
        this.startIndex + this.visibleBooks
      );

      this.logger.log('Carrusel avanzado', { startIndex: this.startIndex });

    } else {

      this.logger.warn('Intento de avanzar carrusel sin más libros');

    }
  }

  prevBooks() {

    if (this.startIndex > 0) {

      this.startIndex--;

      this.carouselBooks = this.books.slice(
        this.startIndex,
        this.startIndex + this.visibleBooks
      );

      this.logger.log('Carrusel retrocedido', { startIndex: this.startIndex });

    } else {

      this.logger.warn('Intento de retroceder carrusel en inicio');

    }
  }

  // Ir a detalle del libro
  goToBook(book: any) {

    if (!book || !book.id) {

      this.logger.warn('Intento de abrir libro inválido', book);

      return;
    }

    this.logger.info('Usuario intentó abrir libro', book);

    if (book.premium && !this.auth.isPremium()) {

      this.logger.warn('Acceso a libro premium sin suscripción');

      this.router.navigate(['/premium']);

    } else {

      this.logger.log('Navegando al detalle del libro', book.id);

      this.router.navigate(['/book', book.id]);

    }
  }
}