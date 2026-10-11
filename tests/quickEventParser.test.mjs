import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadQuickEventParser = async () => {
  const sourcePath = path.resolve(__dirname, '../utils/quickEventParser.ts');
  const source = await readFile(sourcePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};

const { formatDateTimeLocal, parseQuickEventPrompt } = await loadQuickEventParser();

test('parseQuickEventPrompt parses the sample devops session for the next matching weekday', () => {
  const now = new Date(2026, 9, 12, 9, 0, 0);

  const result = parseQuickEventPrompt('crea una sesion de devops para el miercoles a la 10 am', now);

  assert.ok(!('error' in result), `unexpected parse error: ${result.error}`);
  assert.equal(result.eventName, 'Sesión de devops');
  assert.equal(formatDateTimeLocal(result.targetDate), '2026-10-14T10:00');
});

test('parseQuickEventPrompt rolls a same-day weekday prompt to the following week at the time boundary', () => {
  const now = new Date(2026, 9, 14, 10, 0, 0);

  const result = parseQuickEventPrompt('agenda reunion de plataforma para miercoles a las 10 am', now);

  assert.ok(!('error' in result), `unexpected parse error: ${result.error}`);
  assert.equal(formatDateTimeLocal(result.targetDate), '2026-10-21T10:00');
});

test('parseQuickEventPrompt rejects prompts whose interpreted date-time is already in the past', () => {
  const now = new Date(2026, 9, 11, 9, 0, 0);

  const result = parseQuickEventPrompt('crea una sesion de devops para hoy a las 8 am', now);

  assert.deepEqual(result, {
    error: 'La fecha interpretada ya pasó. Indica una fecha y hora futuras.',
  });
});
