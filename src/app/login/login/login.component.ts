import { Component } from '@angular/core';
import { SeviciosService } from '../../sevicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: SeviciosService) {}

  onLogin(): void {
    // console.log('Iniciando sesión con:', this.email, this.password);
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        if (response.status === 'success') {
          this.authService.redirectUser(response.role);
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.error.message;
      }
    );
  }
  
}