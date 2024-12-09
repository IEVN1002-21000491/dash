import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeviciosService {
  private uploadUrl = 'http://localhost/uploadVideo.php';
  private baseUrl = 'http://localhost:5000';

  // BehaviorSubject para almacenar el rol del usuario
  private roleSubject = new BehaviorSubject<string | null>(this.getUserRole());

  constructor(private http: HttpClient, private router: Router) {}

  uploadVideo(video: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', video);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          const user = { role: response.role, token: 'fakeToken' };
          localStorage.setItem('user', JSON.stringify(user));
          this.roleSubject.next(user.role); // Actualiza el rol en tiempo real
        }
      })
    );
  }
  agregarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes`, cliente);
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.roleSubject.next(null); // Limpia el rol en tiempo real
    this.router.navigate(['/login/login']);
  }

  redirectUser(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/dash']);
    } else if (role === 'gerente') {
      this.router.navigate(['/dash']);
    } else if (role === 'cliente') {
      this.router.navigate(['/dash/procesos']);
    }
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }
  // Método para obtener el BehaviorSubject como Observable
  getRole$(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }
  obtenerPreguntas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/preguntas`);
  }
  obtenerRespuestas(idPregunta: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/respuestas/${idPregunta}`);
  }
  obtenerClientes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientes`);
  }
  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}`, cliente);
  }
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clientes/${id}`);
  }
  obtenerPrimerVideo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/videos/first`);
  }

  obtenerVideos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/videos`);
  }
}
