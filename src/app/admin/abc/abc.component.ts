import { Component } from '@angular/core';
import { SeviciosService } from '../../sevicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-abc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,ReactiveFormsModule],
  templateUrl: './abc.component.html',
  styles: ``,
})
export default class AbcComponent {
  formulario!: FormGroup;
  clientes: any[] = [];
  clienteEnEdicion: number | null = null; // ID del cliente en edición
  mostrandoFormulario: boolean = false; // Controla la visibilidad del formulario

  constructor(private servicio: SeviciosService) {}

  ngOnInit(): void {
    this.obtenerClientes();
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', Validators.required),
    });
  }
  toggleFormulario(): void {
    this.mostrandoFormulario = !this.mostrandoFormulario; // Alterna la visibilidad
    if (!this.mostrandoFormulario) {
      this.formulario.reset(); // Limpia el formulario si se oculta
    }
  }
  

  mostrarFormulario(): void {
    this.mostrandoFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario = false;
    this.formulario.reset();
  }

  agregarCliente(): void {
    if (this.formulario.valid) {
      this.servicio.agregarCliente(this.formulario.value).subscribe(() => {
        console.log('Cliente agregado con éxito');
        this.obtenerClientes(); // Actualiza la lista
        this.cancelarFormulario(); // Oculta el formulario
      });
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }

  obtenerClientes(): void {
    this.servicio.obtenerClientes().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.clientes = response.clientes;
        } else {
          console.error('Error al obtener clientes:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      },
    });
  }

  editarCliente(id: number): void {
    this.clienteEnEdicion = id; // Establece el cliente en edición
  }

  cancelarEdicion(): void {
    this.clienteEnEdicion = null; // Cancela la edición
  }

  actualizarCliente(cliente: any): void {
    this.servicio.actualizarCliente(cliente.id, cliente).subscribe({
      next: () => {
        alert('Cliente actualizado correctamente.');
        this.clienteEnEdicion = null; // Termina la edición
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        alert('No se pudo actualizar el cliente.');
      },
    });
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.servicio.eliminarCliente(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
          alert('Cliente eliminado correctamente.');
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          alert('No se pudo eliminar el cliente.');
        },
      });
    }
  }
}
