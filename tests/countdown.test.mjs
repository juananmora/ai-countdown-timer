import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../hooks/calculateTimeLeft.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { calculateTimeLeft } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const OriginalDate = globalThis.Date;
const fixedNow = OriginalDate.parse('2026-01-01T00:00:00.000Z');

function freezeNow() {
  globalThis.Date = class extends OriginalDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow] : args));
    }
  };
}

test('calculates remaining days, hours, minutes, and seconds', () => {
  freezeNow();
  try {
    assert.deepEqual(
      calculateTimeLeft(new OriginalDate(fixedNow + 26 * 60 * 60 * 1000 + 3 * 60 * 1000 + 4_999)),
      { days: 1, hours: 2, minutes: 3, seconds: 4 },
    );
  } finally {
    globalThis.Date = OriginalDate;
  }
});

test('returns zero units when the target is exactly now', () => {
  freezeNow();
  try {
    assert.deepEqual(calculateTimeLeft(new OriginalDate(fixedNow)), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  } finally {
    globalThis.Date = OriginalDate;
  }
});

test('returns null when no target date is configured', () => {
  assert.equal(calculateTimeLeft(null), null);
});

test('rejects an invalid target date', () => {
  assert.throws(() => calculateTimeLeft(new OriginalDate(Number.NaN)), {
    name: 'RangeError',
    message: 'targetDate must be a valid date',
  });
});
