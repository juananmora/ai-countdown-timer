import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../utils/countdown.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: 'countdown.ts',
});
const { calculateTimeLeft } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('calcula días, horas, minutos y segundos restantes', () => {
  const now = new Date('2026-11-01T09:30:33.000Z');
  const target = new Date('2026-11-03T11:32:36.000Z');

  assert.deepEqual(calculateTimeLeft(target, now), {
    days: 2,
    hours: 2,
    minutes: 2,
    seconds: 3,
  });
});

test('devuelve cero cuando la fecha objetivo está justo en el límite o ya venció', () => {
  const now = new Date('2026-11-01T09:30:33.000Z');

  assert.deepEqual(calculateTimeLeft(now, now), { days: 0, hours: 0, minutes: 0, seconds: 0 });
  assert.deepEqual(calculateTimeLeft(new Date('2026-11-01T09:30:32.999Z'), now), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('devuelve null para una fecha objetivo ausente', () => {
  assert.equal(calculateTimeLeft(null, new Date('2026-11-01T09:30:33.000Z')), null);
});
