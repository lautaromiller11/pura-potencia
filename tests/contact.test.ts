import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, validate } from '../src/lib/validation.ts';

const validContact = {
  name: '  Ana   Pérez ',
  email: 'ANA@Example.com',
  phone: '+54 9 341 000 0000',
  reason: 'inscripcion',
  message: 'Hola, quiero saber cómo sumarme a los entrenamientos.',
};

test('normaliza espacios, correo y caracteres de control', () => {
  const contact = normalize({ ...validContact, name: 'Ana\u0000   Pérez' });
  assert.equal(contact.name, 'Ana Pérez');
  assert.equal(contact.email, 'ana@example.com');
});

test('acepta una consulta completa sin casilla de aceptación', () => {
  assert.equal(validate(normalize(validContact)).ok, true);
});

test('informa los campos obligatorios faltantes', () => {
  const result = validate(normalize({}));
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.errors).sort(), ['email', 'message', 'name']);
});

test('rechaza correo, teléfono y motivo inválidos', () => {
  const result = validate(normalize({ ...validContact, email: 'no-es-correo', phone: 'abc', reason: 'hack' }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.errors).sort(), ['email', 'phone', 'reason']);
});

test('teléfono y motivo son opcionales', () => {
  assert.equal(validate(normalize({ ...validContact, phone: '', reason: '' })).ok, true);
});
