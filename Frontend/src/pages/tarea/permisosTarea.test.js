import test from 'node:test';
import assert from 'node:assert/strict';
import { puedeModificarTarea, puedeCompletarTarea } from './permisosTarea.js';

const iteracion = { id_iteracion: 1 };

test('espectador y administrador no pueden modificar tareas aunque haya iteración', () => {
  assert.equal(puedeModificarTarea('Espectador', iteracion), false);
  assert.equal(puedeModificarTarea('Administrador', iteracion), false);
});

test('sin iteración nadie puede completar ni deshacer tareas', () => {
  for (const perfil of ['Espectador', 'Lider del proyecto', 'Desarrollador']) {
    assert.equal(puedeModificarTarea(perfil, null), false);
  }
});

test('líder y desarrollador pueden completar con iteración activa', () => {
  assert.equal(puedeModificarTarea('Lider del proyecto', iteracion), true);
  assert.equal(puedeModificarTarea('Desarrollador', iteracion), true);
});

test('una tarea completada no se puede completar de nuevo', () => {
  for (const perfil of ['Lider del proyecto', 'Desarrollador']) {
    assert.equal(puedeCompletarTarea(perfil, iteracion, { estado: '1' }), false);
    assert.equal(puedeCompletarTarea(perfil, iteracion, { estado: 1 }), false);
  }
});

test('solo una tarea pendiente permite completar si el perfil y la iteración lo permiten', () => {
  assert.equal(puedeCompletarTarea('Lider del proyecto', iteracion, { estado: '0' }), true);
  assert.equal(puedeCompletarTarea('Desarrollador', iteracion, { estado: 0 }), true);
  assert.equal(puedeCompletarTarea('Espectador', iteracion, { estado: '0' }), false);
  assert.equal(puedeCompletarTarea('Desarrollador', null, { estado: '0' }), false);
  assert.equal(puedeCompletarTarea('Desarrollador', iteracion, undefined), false);
});
