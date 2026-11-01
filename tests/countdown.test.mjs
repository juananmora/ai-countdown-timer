import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../hooks/countdown.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { calculateTimeLeft } = await import(moduleUrl);

test('calculates days, hours, minutes, and seconds remaining', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const target = new Date('2026-01-02T03:04:05.000Z');

  assert.deepEqual(calculateTimeLeft(target, now), {
    days: 1,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
});

test('returns zero for the exact target and an elapsed target', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  assert.deepEqual(calculateTimeLeft(now, now), zero);
  assert.deepEqual(calculateTimeLeft(new Date(now.getTime() - 1), now), zero);
});

test('returns null when no target date is configured', () => {
  assert.equal(calculateTimeLeft(null, new Date('2026-01-01T00:00:00.000Z')), null);
});

test('rejects invalid dates', () => {
  const invalidDate = new Date(Number.NaN);

  assert.throws(
    () => calculateTimeLeft(invalidDate, new Date('2026-01-01T00:00:00.000Z')),
    { name: 'RangeError', message: 'Target date and current time must be valid dates.' },
  );
});
