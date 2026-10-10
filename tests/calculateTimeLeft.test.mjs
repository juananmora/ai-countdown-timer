import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';

const loadCalculateTimeLeft = async () => {
  const source = await readFile(new URL('../utils/calculateTimeLeft.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'utils/calculateTimeLeft.ts',
  });

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  return import(moduleUrl);
};

const { calculateTimeLeft } = await loadCalculateTimeLeft();

test('calculateTimeLeft returns null when target date is missing', () => {
  assert.equal(calculateTimeLeft(null, new Date('2026-01-01T00:00:00.000Z')), null);
});

test('calculateTimeLeft returns the remaining full days, hours, minutes, and seconds for a future date', () => {
  const currentDate = new Date('2026-01-01T01:02:03.000Z');
  const targetDate = new Date('2026-01-03T04:05:06.000Z');

  assert.deepEqual(calculateTimeLeft(targetDate, currentDate), {
    days: 2,
    hours: 3,
    minutes: 3,
    seconds: 3,
  });
});

test('calculateTimeLeft clamps expired dates to zero for every unit', () => {
  const currentDate = new Date('2026-01-03T04:05:07.000Z');
  const targetDate = new Date('2026-01-03T04:05:06.000Z');

  assert.deepEqual(calculateTimeLeft(targetDate, currentDate), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('calculateTimeLeft also returns zeros when the target date equals the current date', () => {
  const currentDate = new Date('2026-01-03T04:05:06.000Z');

  assert.deepEqual(calculateTimeLeft(currentDate, currentDate), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});
