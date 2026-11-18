export function agruparPuntosTongji(puntos) {
  const grupos = new Map();

  for (const punto of puntos) {
    const clave = `${punto.x},${punto.y}`;
    if (!grupos.has(clave)) {
      grupos.set(clave, { x: punto.x, y: punto.y, cantidad: 0, riesgos: [] });
    }
    const grupo = grupos.get(clave);
    grupo.cantidad += 1;
    grupo.riesgos.push(punto.label);
  }

  return [...grupos.values()];
}

export function etiquetaEjeTongji(valor) {
  return valor >= 1 && valor <= 10 ? String(valor) : '';
}

export function etiquetaTooltipTongji(punto) {
  const riesgos = punto.cantidad > 1
    ? `${punto.cantidad} riesgos (${punto.riesgos.join(', ')})`
    : punto.riesgos[0];
  return `${riesgos}, Impacto: ${punto.x}, Probabilidad: ${punto.y}`;
}

export const pluginCantidadTongji = {
  id: 'cantidadTongji',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const puntos = chart.data.datasets[0].data;
    const posiciones = chart.getDatasetMeta(0).data;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    puntos.forEach((punto, index) => {
      ctx.fillText(String(punto.cantidad), posiciones[index].x, posiciones[index].y);
    });
    ctx.restore();
  },
};
