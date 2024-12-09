import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeviciosService } from '../../sevicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admindashbord',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admindashbord.component.html',
  styles: ``
})
export default class AdmindashbordComponent implements OnInit {
  preguntas: any[] = [];
  respuestas: any[] = [];
  preguntaSeleccionada: number | null = null;

  tiposGraficos = { bar: false, pie: false };
  graficoBarra: boolean = false;
  graficoPastel: boolean = false;

  constructor(private graficosService: SeviciosService) {}

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  cargarPreguntas(): void {
    this.graficosService.obtenerPreguntas().subscribe(response => {
      if (response.status === 'success') {
        this.preguntas = response.preguntas;
        console.log('Preguntas cargadas:', this.preguntas); // Verifica las preguntas aquí
      } else {
        console.error('Error al cargar preguntas:', response);
      }
    });
  }

  cargarRespuestas(): void {
    if (this.preguntaSeleccionada !== null) {
      this.graficosService.obtenerRespuestas(this.preguntaSeleccionada).subscribe(response => {
        if (response.status === 'success') {
          this.respuestas = response.respuestas;
          console.log('Respuestas cargadas:', this.respuestas); // Verifica las respuestas aquí
        } else {
          console.error('Error al cargar respuestas:', response);
        }
      });
    }
  }

  generarGrafico(): void {
    if (this.tiposGraficos.bar) {
      this.graficoBarra = true;
      this.graficoPastel = false;
      setTimeout(() => this.generarGraficoBarra());
    } else if (this.tiposGraficos.pie) {
      this.graficoPastel = true;
      this.graficoBarra = false;
      setTimeout(() => this.generarGraficoPastel());
    }
  }
  

  generarGraficoBarra(): void {
    const svg = document.getElementById('grafico-svg') as unknown as SVGElement;
  
    if (!svg) {
      console.error('El elemento SVG no se encontró en el DOM.');
      console.log('Estado actual de graficoBarra:', this.graficoBarra);
      return;
    }
  
    // Limpia gráficos previos
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  
    const maxCantidad = Math.max(...this.respuestas.map(r => r.cantidad));
    const barWidth = 50;
    const spacing = 20;
    const chartHeight = 300;
  
    this.respuestas.forEach((respuesta, index) => {
      const barHeight = (respuesta.cantidad / maxCantidad) * chartHeight;
  
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${index * (barWidth + spacing)}`);
      rect.setAttribute('y', `${chartHeight - barHeight}`);
      rect.setAttribute('width', `${barWidth}`);
      rect.setAttribute('height', `${barHeight}`);
      rect.setAttribute('fill', 'blue');
  
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textY = Math.max(chartHeight - barHeight - 5, 10); // Evita que el texto salga del área
      text.setAttribute('x', `${index * (barWidth + spacing) + barWidth / 2}`);
      text.setAttribute('y', `${textY}`);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = respuesta.cantidad.toString();

  
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', `${index * (barWidth + spacing) + barWidth / 2}`);
      label.setAttribute('y', `${chartHeight + 15}`);
      label.setAttribute('text-anchor', 'middle');
      label.textContent = respuesta.respuesta;
  
      svg.appendChild(rect);
      svg.appendChild(text);
      svg.appendChild(label);
    });
  
    console.log('Gráfico de barras generado.');
  }
  generarGraficoPastel(): void {
    const svg = document.getElementById('grafico-svg') as unknown as SVGElement;
  
    if (!svg) {
      console.error('El elemento SVG no se encontró en el DOM.');
      return;
    }
  
    // Limpia gráficos previos
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  
    const total = this.respuestas.reduce((sum, r) => sum + r.cantidad, 0);
    const centerX = 200; // Cambiamos para dejar espacio a la derecha
    const centerY = 200;
    const radius = 150;
    let startAngle = 0;
  
    // Contenedor para las etiquetas
    const legendX = 450; // Posición derecha
    const legendYStart = 50; // Posición inicial
    const legendSpacing = 20;
  
    this.respuestas.forEach((respuesta, index) => {
      const sliceAngle = (respuesta.cantidad / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
  
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
  
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
  
      const pathData = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
  
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const color = this.getRandomColor(); // Generamos color único
      path.setAttribute('d', pathData);
      path.setAttribute('fill', color);
  
      svg.appendChild(path);
  
      // Mostrar valor en el gráfico
      const textAngle = startAngle + sliceAngle / 2;
      const textX = centerX + (radius / 2) * Math.cos(textAngle);
      const textY = centerY + (radius / 2) * Math.sin(textAngle);
  
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', `${textX}`);
      valueText.setAttribute('y', `${textY}`);
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('fill', '#fff');
      valueText.textContent = respuesta.cantidad.toString();
  
      svg.appendChild(valueText);
  
      // Añadir leyenda a la derecha
      const legendY = legendYStart + index * legendSpacing;
  
      const legendRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      legendRect.setAttribute('x', `${legendX}`);
      legendRect.setAttribute('y', `${legendY}`);
      legendRect.setAttribute('width', '15');
      legendRect.setAttribute('height', '15');
      legendRect.setAttribute('fill', color);
  
      const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      legendText.setAttribute('x', `${legendX + 20}`);
      legendText.setAttribute('y', `${legendY + 12}`); // Ajustamos verticalmente
      legendText.setAttribute('font-size', '12');
      legendText.textContent = respuesta.respuesta;
  
      svg.appendChild(legendRect);
      svg.appendChild(legendText);
  
      startAngle = endAngle;
    });
  
    console.log('Gráfico de pastel generado.');
  }
  


  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}