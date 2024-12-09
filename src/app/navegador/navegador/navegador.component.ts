import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeviciosService } from '../../sevicios.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navegador',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navegador.component.html',
  styles: ``
})
export class NavegadorComponent implements OnInit, OnDestroy {
  role: string | null = null;
  private roleSubscription: Subscription | null = null;

  constructor(private authService: SeviciosService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Suscribirse al rol y detectar cambios manualmente
    this.roleSubscription = this.authService.getRole$().subscribe((role) => {
      this.role = role; // Actualiza el rol
      this.cdr.detectChanges(); // Fuerza la detección de cambios
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    // Cancela la suscripción al destruir el componente
    this.roleSubscription?.unsubscribe();
  }
}
