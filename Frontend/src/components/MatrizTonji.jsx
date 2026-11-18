import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import { useTema } from '../context/temaContext';
import { agruparPuntosTongji, etiquetaEjeTongji, etiquetaTooltipTongji, pluginCantidadTongji } from './datosMatrizTonji';

ChartJS.register(PointElement, LinearScale, Title, Tooltip, Legend);
  
  // Función que devuelve el color de cada celda (1x1)
  function getRiskColor(x, y) {
    const riesgo = x * y;
  
    if (riesgo < 9) return "#2ecc71"; // verde
    if (riesgo < 36) return "#f1c40f"; // amarillo
    if (riesgo < 64) return "#f39c12"; // naranja
    return "#e74c3c"; // rojo
  }
  
  const backgroundPlugin = {
    id: 'backgroundPlugin',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
  
      for (let x = 0; x <= 10; x++) {
        for (let y = 0; y <= 10; y++) {
          const color = getRiskColor(x, y);
  
          const xStart = xScale.getPixelForValue(x);
          const xEnd = xScale.getPixelForValue(x + 1);
          const yStart = yScale.getPixelForValue(y);
          const yEnd = yScale.getPixelForValue(y + 1);
  
          ctx.fillStyle = color;
          ctx.fillRect(xStart, yEnd, xEnd - xStart, yStart - yEnd);
        }
      }
    },
  };
  
  
  function MantrizTonji({puntos}, ref) {
    const scatterRef = useRef(null);
    const { temaOscuro } = useTema();
    const colorTexto = temaOscuro ? '#f3f4f6' : '#1f2937';
    const puntosAgrupados = agruparPuntosTongji(puntos);
    const options = {
      responsive: false,
      scales: {
        x: {
          min: 0,
          max: 11,
          ticks: { stepSize: 1, color: colorTexto, callback: etiquetaEjeTongji },
          title: { display: true, text: 'Impacto', color: colorTexto },
        },
        y: {
          min: 0,
          max: 11,
          ticks: { stepSize: 1, color: colorTexto, callback: etiquetaEjeTongji },
          title: { display: true, text: 'Probabilidad', color: colorTexto },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => etiquetaTooltipTongji(context.raw)
          },
        },
      },
    };

    useImperativeHandle(ref, ()=>({
      getScatterRef: () => scatterRef.current
    }))

    return (
      <Scatter 
      ref={scatterRef}
      data={
        {
          datasets: [
            {
              data: puntosAgrupados,
              backgroundColor: 'black',
              pointRadius: puntosAgrupados.map(({ cantidad }) =>
                Math.max(11, 5 + String(cantidad).length * 4)
              ),
            },
          ]
        }
      } options={options} plugins={[backgroundPlugin, pluginCantidadTongji]} height={280} width={400}/>
    );
  }

export default forwardRef(MantrizTonji);
