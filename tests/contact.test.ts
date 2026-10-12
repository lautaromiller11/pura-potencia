import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, validate } from '../src/lib/validation.ts';
import { buildEmail, createRateLimiter, processContact, type ContactEnv } from '../src/lib/contact-service.ts';

const NOW = 1_800_000_000_000;
const goodPayload = () => ({
  name: '  Ana   Pérez ',
  email: 'ANA@Example.com',
  phone: '+54 9 341 000 0000',
  reason: 'inscripcion',
  message: 'Hola, quiero saber cómo sumarme a los entrenamientos.',
  consent: true,
  website: '',
  startedAt: NOW - 10_000,
});
const fullEnv: ContactEnv = { RESEND_API_KEY: 're_test', CONTACT_TO_EMAIL: 'dest@test.invalid', CONTACT_FROM_EMAIL: 'Web <web@test.invalid>' };
const okFetch = (async () => new Response(JSON.stringify({ id: 'abc123' }), { status: 200 })) as typeof fetch;

test('normaliza espacios, mayúsculas del correo y caracteres de control', () => {
  const n = normalize({ ...goodPayload(), name: 'Ana\u0000   Pérez' });
  assert.equal(n.name, 'Ana Pérez');
  assert.equal(n.email, 'ana@example.com');
});

test('valida una consulta correcta', () => {
  const r = validate(normalize(goodPayload()));
  assert.equal(r.ok, true);
});

test('campos obligatorios y mensajes en español', () => {
  const r = validate(normalize({}));
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.deepEqual(Object.keys(r.errors).sort(), ['consent', 'email', 'message', 'name']);
  }
});

test('rechaza correo, teléfono y motivo inválidos', () => {
  const r = validate(normalize({ ...goodPayload(), email: 'no-es-correo', phone: 'abc', reason: 'hack' }));
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ['email', 'phone', 'reason']);
});

test('teléfono y motivo son opcionales', () => {
  const r = validate(normalize({ ...goodPayload(), phone: '', reason: '' }));
  assert.equal(r.ok, true);
});

test('el correo escapa HTML y evita inyección en el asunto', () => {
  const r = validate(normalize({ ...goodPayload(), name: 'Ana <b>x</b>\r\nBcc: a@b.com', message: '<script>alert(1)</script> mensaje largo' }));
  assert.ok(r.ok);
  if (r.ok) {
    const mail = buildEmail(r.data);
    assert.ok(!mail.html.includes('<script>'));
    assert.ok(!/[\r\n]/.test(mail.subject));
  }
});

test('honeypot completo: responde ok pero NO envía', async () => {
  let called = false;
  const res = await processContact({
    payload: { ...goodPayload(), website: 'http://spam' }, ip: '1.1.1.1', env: fullEnv, now: NOW,
    limiter: createRateLimiter(), fetchImpl: (async () => { called = true; return new Response('{}'); }) as typeof fetch,
  });
  assert.equal(res.status, 200);
  assert.equal(called, false);
});

test('envío demasiado rápido es rechazado', async () => {
  const res = await processContact({ payload: { ...goodPayload(), startedAt: NOW - 200 }, ip: '1.1.1.1', env: fullEnv, now: NOW, limiter: createRateLimiter(), fetchImpl: okFetch });
  assert.equal(res.status, 400);
});

test('datos inválidos devuelven 422 con errores por campo', async () => {
  const res = await processContact({ payload: { ...goodPayload(), email: 'x' }, ip: '1.1.1.1', env: fullEnv, now: NOW, limiter: createRateLimiter(), fetchImpl: okFetch });
  assert.equal(res.status, 422);
  assert.ok(res.body.errors?.email);
});

test('sin credenciales NO se simula el envío (503)', async () => {
  const res = await processContact({ payload: goodPayload(), ip: '1.1.1.1', env: {}, now: NOW, limiter: createRateLimiter(), fetchImpl: okFetch });
  assert.equal(res.status, 503);
  assert.equal(res.body.ok, false);
});

test('éxito solo cuando Resend acepta y devuelve id; usa reply_to y clave en el header', async () => {
  let sent: { headers: Record<string, string>; body: Record<string, unknown> } | undefined;
  const res = await processContact({
    payload: goodPayload(), ip: '2.2.2.2', env: fullEnv, now: NOW, limiter: createRateLimiter(),
    fetchImpl: (async (_url: unknown, init: RequestInit) => {
      sent = { headers: init.headers as Record<string, string>, body: JSON.parse(String(init.body)) };
      return new Response(JSON.stringify({ id: 'abc123' }), { status: 200 });
    }) as typeof fetch,
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(sent?.headers.Authorization, 'Bearer re_test');
  assert.equal(sent?.body.reply_to, 'ana@example.com');
  assert.deepEqual(sent?.body.to, ['dest@test.invalid']);
});

test('si Resend rechaza, no hay éxito y el error es genérico', async () => {
  const res = await processContact({
    payload: goodPayload(), ip: '3.3.3.3', env: fullEnv, now: NOW, limiter: createRateLimiter(),
    fetchImpl: (async () => new Response(JSON.stringify({ message: 'API key is invalid secret-detail' }), { status: 403 })) as typeof fetch,
  });
  assert.equal(res.status, 502);
  assert.equal(res.body.ok, false);
  assert.ok(!JSON.stringify(res.body).includes('secret-detail'));
});

test('si falla la red, no hay éxito', async () => {
  const res = await processContact({
    payload: goodPayload(), ip: '4.4.4.4', env: fullEnv, now: NOW, limiter: createRateLimiter(),
    fetchImpl: (async () => { throw new Error('boom'); }) as typeof fetch,
  });
  assert.equal(res.status, 502);
});

test('el limitador corta la ráfaga y libera tras la ventana', () => {
  const l = createRateLimiter(2, 1000);
  assert.equal(l.hit('a', 0), true);
  assert.equal(l.hit('a', 10), true);
  assert.equal(l.hit('a', 20), false);
  assert.equal(l.hit('b', 20), true);
  assert.equal(l.hit('a', 2000), true);
});
