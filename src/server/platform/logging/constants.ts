import type { LogLevel } from './types';

export const LOG_LEVEL_PRIORITY: Readonly<Record<LogLevel, number>> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

export const SENSITIVE_FIELD_PATTERN =
    /authorization|cookie|credential|password|private|secret|token|api[_-]?key/i;
