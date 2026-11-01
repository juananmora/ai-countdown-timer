import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../hooks/calculateTimeLeft.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { calculateTimeLeft } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('calcula correctamente los días, horas, minutos y segundos restantes', () => {
  const now = new Date('2026-11-01T00:00:00.000Z');
  const target = new Date('2026-11-03T03:04:05.000Z');

  assert.deepEqual(calculateTimeLeft(target, now), {
    days: 2,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
});

test('devuelve cero cuando la cuenta regresiva llega exactamente al límite', () => {
  const instant = new Date('2026-11-01T00:00:00.000Z');

  assert.deepEqual(calculateTimeLeft(instant, instant), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('devuelve null si no se proporciona una fecha objetivo', () => {
  assert.equal(calculateTimeLeft(null, new Date('2026-11-01T00:00:00.000Z')), null);
});
