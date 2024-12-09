import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import InicioComponent from "./admin/inicio/inicio.component";
import { NavegadorComponent } from "./navegador/navegador/navegador.component";
import LoginComponent from "./login/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InicioComponent, NavegadorComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard';
}