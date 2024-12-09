import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms';

interface Task {
  title: string;
  description: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadir FormsModule aquí
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export default class InicioComponent implements OnInit, OnDestroy {
  hora: string = '00:00:00';
  private intervalo: any;

  mesActual: string = '';
  anioActual: number = 0;
  diasCalendario: { dia: number; esHoy: boolean; esMesActual: boolean }[] = [];

  tasks: Task[] = [];
  newTask: Task = { title: '', description: '' };

  constructor() {}

  ngOnInit(): void {
    this.iniciarRelojDigital();
    this.iniciarRelojAnalogo();
    this.generarCalendario(new Date());
    this.loadTasks();
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  iniciarRelojDigital(): void {
    this.intervalo = setInterval(() => {
      const now = new Date();
      this.hora = now.toLocaleTimeString();
    }, 1000);
  }

  iniciarRelojAnalogo(): void {
    const secondHand = document.querySelector('.second-hand') as HTMLElement;
    const minuteHand = document.querySelector('.minute-hand') as HTMLElement;
    const hourHand = document.querySelector('.hour-hand') as HTMLElement;

    this.intervalo = setInterval(() => {
      const now = new Date();

      const seconds = now.getSeconds();
      const secondsDegrees = (seconds / 60) * 360 + 90;
      if (secondHand) secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

      const minutes = now.getMinutes();
      const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
      if (minuteHand) minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;

      const hours = now.getHours();
      const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;
      if (hourHand) hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }, 1000);
  }

  generarCalendario(fecha: Date): void {
    const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    const primerDiaSemana = inicioMes.getDay();
    const diasEnMes = finMes.getDate();

    this.mesActual = inicioMes.toLocaleString('default', { month: 'long' });
    this.anioActual = inicioMes.getFullYear();

    const hoy = new Date();
    this.diasCalendario = [];

    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = new Date(inicioMes);
      dia.setDate(dia.getDate() - (i + 1));
      this.diasCalendario.push({ dia: dia.getDate(), esHoy: false, esMesActual: false });
    }

    for (let i = 1; i <= diasEnMes; i++) {
      this.diasCalendario.push({
        dia: i,
        esHoy: hoy.toDateString() === new Date(fecha.getFullYear(), fecha.getMonth(), i).toDateString(),
        esMesActual: true,
      });
    }

    const diasRestantes = 42 - this.diasCalendario.length;
    for (let i = 1; i <= diasRestantes; i++) {
      this.diasCalendario.push({ dia: i, esHoy: false, esMesActual: false });
    }
  }

  addTask(): void {
    if (this.newTask.title && this.newTask.description) {
      this.tasks.push({ ...this.newTask });
      this.newTask = { title: '', description: '' };
      this.saveTasks();
    }
  }

  completeTask(index: number): void {
    this.tasks.splice(index, 1);
    this.saveTasks();
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks(): void {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }
}
