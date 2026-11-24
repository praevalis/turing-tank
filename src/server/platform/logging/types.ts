export type LogLevel = 'debug' | 'error' | 'info' | 'warn';

export type LogField = boolean | null | number | string | undefined;

export type LogFields = Readonly<Record<string, LogField>>;

export interface LoggerOptions {
    baseFields?: LogFields;
    minimumLevel?: LogLevel;
}
