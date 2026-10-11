import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const loadCountdownModule = async () => {
  const sourcePath = path.join(process.cwd(), 'hooks', 'useCountdown.ts');
  const outputDir = path.join(process.cwd(), 'tests', '.compiled');
  const outputPath = path.join(outputDir, 'useCountdown.mjs');
  const source = await fs.readFile(sourcePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, outputText);

  return import(`${pathToFileURL(outputPath).href}?t=${Date.now()}`);
};

const { calculateTimeLeft } = await loadCountdownModule();

const withFrozenNow = (isoString, run) => {
  const RealDate = Date;
  const fixedNow = new RealDate(isoString);

  class FakeDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(fixedNow);
        return;
      }

      super(...args);
    }

    static now() {
      return fixedNow.getTime();
    }

    static parse(value) {
      return RealDate.parse(value);
    }

    static UTC(...args) {
      return RealDate.UTC(...args);
    }
  }

  globalThis.Date = FakeDate;

  try {
    return run(RealDate);
  } finally {
    globalThis.Date = RealDate;
  }
};

test('calculateTimeLeft returns the expected breakdown for a future date', () => {
  withFrozenNow('2026-10-11T08:59:15Z', (RealDate) => {
    const targetDate = new RealDate('2026-10-12T10:30:45Z');

    assert.deepEqual(calculateTimeLeft(targetDate), {
      days: 1,
      hours: 1,
      minutes: 31,
      seconds: 30,
    });
  });
});

test('calculateTimeLeft returns zeroed units when the target date has arrived', () => {
  withFrozenNow('2026-10-12T10:00:00Z', (RealDate) => {
    const targetDate = new RealDate('2026-10-12T10:00:00Z');

    assert.deepEqual(calculateTimeLeft(targetDate), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});

test('calculateTimeLeft throws for an invalid Date input', () => {
  assert.throws(
    () => calculateTimeLeft(new Date('not-a-date')),
    new RangeError('Invalid target date'),
  );
});

test('calculateTimeLeft returns null when countdown has no target date', () => {
  assert.equal(calculateTimeLeft(null), null);
});
