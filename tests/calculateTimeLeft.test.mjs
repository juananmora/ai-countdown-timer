import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../utils/calculateTimeLeft.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { calculateTimeLeft } = await import(moduleUrl);

const now = new Date('2026-11-01T08:00:00.000Z');

test('calculates remaining days, hours, minutes, and seconds', () => {
  const target = new Date('2026-11-03T11:04:05.000Z');
  assert.deepEqual(calculateTimeLeft(target, now), {
    days: 2,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
});

test('returns zero for a target at the current-time boundary', () => {
  assert.deepEqual(calculateTimeLeft(now, now), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('rejects an invalid target date', () => {
  assert.throws(() => calculateTimeLeft(new Date(Number.NaN), now), {
    name: 'RangeError',
    message: 'Target date and current time must be valid dates.',
  });
});
