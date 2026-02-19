import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  // Aquí puedes agregar lógica de categorías si es necesario
  categories = [
    { name: 'Ficción', description: 'Novelas y relatos imaginativos' },
    { name: 'No Ficción', description: 'Ensayos, biografías y textos informativos' },
    { name: 'Ciencia', description: 'Libros de ciencia y tecnología' },
    { name: 'Historia', description: 'Libros de historia y sociedad' },
    { name: 'Autoayuda', description: 'Crecimiento personal y motivación' },
    { name: 'Infantil', description: 'Libros para niños y jóvenes' }
  ];
}
