import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../utils/time.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const implementationUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { calculateTimeLeft } = await import(implementationUrl);

test('calculates remaining days, hours, minutes, and seconds', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const target = new Date('2026-01-02T03:04:05.000Z');

  assert.deepEqual(calculateTimeLeft(target, now), {
    days: 1,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
});

test('returns zero for a target at the current instant', () => {
  const instant = new Date('2026-01-01T00:00:00.000Z');

  assert.deepEqual(calculateTimeLeft(instant, instant), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('rejects an invalid target date', () => {
  assert.throws(
    () => calculateTimeLeft(new Date(Number.NaN), new Date('2026-01-01T00:00:00.000Z')),
    { name: 'RangeError', message: 'targetDate must be a valid date' },
  );
});

test('returns null when no countdown target is set', () => {
  assert.equal(calculateTimeLeft(null, new Date('2026-01-01T00:00:00.000Z')), null);
});
