export interface QuickEventParseResult {
  eventName: string;
  targetDate: Date;
}

const WEEKDAY_INDEX: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const trimPunctuation = (value: string) => value.trim().replace(/^[,.;:!?]+|[,.;:!?]+$/g, '').trim();

const extractEventName = (prompt: string) => {
  const sessionMatch = prompt.match(/(?:sesion|sesión)\s+de\s+(.+?)(?=\s+para\b|\s+a\s+las?\b|\s+el\b|$)/i);
  if (sessionMatch?.[1]) {
    return `Sesión de ${trimPunctuation(sessionMatch[1])}`;
  }

  const meetingMatch = prompt.match(/(?:reunion|reunión|evento|clase|taller)\s+de\s+(.+?)(?=\s+para\b|\s+a\s+las?\b|\s+el\b|$)/i);
  if (meetingMatch?.[1]) {
    const prefixMatch = prompt.match(/(?:reunion|reunión|evento|clase|taller)/i);
    const prefix = prefixMatch ? prefixMatch[0] : 'Evento';
    return `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)} de ${trimPunctuation(meetingMatch[1])}`;
  }

  const withoutCommand = prompt
    .replace(/^(?:crea|crear|agenda|programa|pon|inicia)\s+/i, '')
    .split(/\s+para\b/i)[0];
  const fallbackName = trimPunctuation(withoutCommand);

  return fallbackName || 'Nuevo evento';
};

const parseTime = (normalizedPrompt: string) => {
  const timeMatch = normalizedPrompt.match(/(?:a\s+las?|alas?)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/)
    ?? normalizedPrompt.match(/\b(\d{1,2})(?::(\d{2}))\s*(am|pm)?\b/);

  if (!timeMatch) {
    return null;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] ?? '0');
  const meridiem = timeMatch[3];

  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
    return null;
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      return null;
    }

    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    }

    if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }
  }

  return { hours, minutes };
};

const resolveBaseDate = (normalizedPrompt: string, now: Date) => {
  if (normalizedPrompt.includes('manana')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return { date: tomorrow, kind: 'tomorrow' as const };
  }

  if (normalizedPrompt.includes('hoy')) {
    return { date: new Date(now), kind: 'today' as const };
  }

  const weekday = Object.keys(WEEKDAY_INDEX).find((day) => normalizedPrompt.includes(day));
  if (!weekday) {
    return null;
  }

  const candidate = new Date(now);
  const targetWeekday = WEEKDAY_INDEX[weekday];
  const daysAhead = (targetWeekday - now.getDay() + 7) % 7;
  candidate.setDate(now.getDate() + daysAhead);
  return { date: candidate, kind: 'weekday' as const };
};

export const parseQuickEventPrompt = (prompt: string, now = new Date()): QuickEventParseResult | { error: string } => {
  const cleanedPrompt = prompt.trim();
  if (!cleanedPrompt) {
    return { error: 'Escribe una instrucción para crear la cuenta regresiva.' };
  }

  const normalizedPrompt = normalizeText(cleanedPrompt);
  const time = parseTime(normalizedPrompt);
  if (!time) {
    return { error: 'No pude identificar la hora. Usa un formato como "a las 10 am" o "a las 18:30".' };
  }

  const baseDateResult = resolveBaseDate(normalizedPrompt, now);
  if (!baseDateResult) {
    return { error: 'No pude identificar el día. Prueba con "hoy", "mañana" o un día de la semana.' };
  }

  const targetDate = new Date(baseDateResult.date);
  targetDate.setHours(time.hours, time.minutes, 0, 0);

  if (baseDateResult.kind === 'weekday' && targetDate <= now) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  if (targetDate <= now) {
    return { error: 'La fecha interpretada ya pasó. Indica una fecha y hora futuras.' };
  }

  return {
    eventName: extractEventName(cleanedPrompt),
    targetDate,
  };
};

export const formatDateTimeLocal = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
