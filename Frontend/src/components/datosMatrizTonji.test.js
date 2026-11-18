import test from 'node:test';
import assert from 'node:assert/strict';
import { agruparPuntosTongji, etiquetaEjeTongji, etiquetaTooltipTongji, pluginCantidadTongji } from './datosMatrizTonji.js';

test('los ejes muestran solo los valores del 1 al 10 con margen en 0 y 11', () => {
  assert.equal(etiquetaEjeTongji(0), '');
  assert.equal(etiquetaEjeTongji(1), '1');
  assert.equal(etiquetaEjeTongji(5), '5');
  assert.equal(etiquetaEjeTongji(10), '10');
  assert.equal(etiquetaEjeTongji(11), '');
});

test('agrupa riesgos con el mismo impacto y probabilidad sin mezclar otras posiciones', () => {
  const puntos = [
    { x: 2, y: 3, label: 'RK01' },
    { x: 4, y: 3, label: 'RK02' },
    { x: 2, y: 3, label: 'RK03' },
  ];

  assert.deepEqual(agruparPuntosTongji(puntos), [
    { x: 2, y: 3, cantidad: 2, riesgos: ['RK01', 'RK03'] },
    { x: 4, y: 3, cantidad: 1, riesgos: ['RK02'] },
  ]);
  assert.deepEqual(puntos[0], { x: 2, y: 3, label: 'RK01' });
});

test('sin datos no genera puntos', () => {
  assert.deepEqual(agruparPuntosTongji([]), []);
});

test('el tooltip indica cantidad y todos los identificadores del grupo', () => {
  assert.equal(
    etiquetaTooltipTongji({ x: 2, y: 3, cantidad: 2, riesgos: ['RK01', 'RK03'] }),
    '2 riesgos (RK01, RK03), Impacto: 2, Probabilidad: 3'
  );
  assert.equal(
    etiquetaTooltipTongji({ x: 4, y: 3, cantidad: 1, riesgos: ['RK02'] }),
    'RK02, Impacto: 4, Probabilidad: 3'
  );
});

test('pinta la cantidad de todos los puntos, incluidos los únicos, dentro del canvas exportable', () => {
  const pintados = [];
  const ctx = {
    save() {},
    restore() {},
    fillText(...args) { pintados.push(args); },
  };
  const chart = {
    ctx,
    data: { datasets: [{ data: [
      { cantidad: 1 }, { cantidad: 2 }, { cantidad: 12 },
    ] }] },
    getDatasetMeta: () => ({ data: [
      { x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 },
    ] }),
  };

  pluginCantidadTongji.afterDatasetsDraw(chart);

  assert.deepEqual(pintados, [['1', 10, 20], ['2', 30, 40], ['12', 50, 60]]);
});
