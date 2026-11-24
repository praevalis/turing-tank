import { getServerConfig } from '@/server/platform/config';
import { TuringError } from '@/server/platform/errors';

import { LOG_LEVEL_PRIORITY, SENSITIVE_FIELD_PATTERN } from './constants';
import type { LogFields, LogLevel, LoggerOptions } from './types';

interface LogEntry {
    event: string;
    fields: LogFields;
    level: LogLevel;
    message: string;
    timestamp: string;
}

/**
 * Redacts fields whose names commonly contain credentials or private values.
 *
 * @param fields Structured fields supplied by a log caller.
 * @returns Fields with sensitive values replaced.
 */
function redactFields(fields: LogFields): LogFields {
    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
            key,
            SENSITIVE_FIELD_PATTERN.test(key) ? '[REDACTED]' : value,
        ]),
    );
}

/**
 * Converts an error into safe structured diagnostic fields.
 *
 * @param error Value supplied by a log caller.
 * @returns Safe error fields, or undefined for non-Error values.
 */
function serializeError(error: unknown): LogFields | undefined {
    if (error instanceof TuringError) {
        return {
            error_code: error.code,
            error_kind: error.kind,
            error_message: error.message,
            ...(error.stack === undefined ? {} : { error_stack: error.stack }),
        };
    }

    if (!(error instanceof Error)) {
        return undefined;
    }

    return {
        error_name: error.name,
        error_message: error.message,
        ...(error.stack === undefined ? {} : { error_stack: error.stack }),
    };
}

/**
 * Writes structured JSON logs to the process output streams.
 */
export class Logger {
    private readonly baseFields: LogFields;
    private readonly minimumLevel: LogLevel;

    public constructor(options: LoggerOptions = {}) {
        this.baseFields = options.baseFields ?? {};
        this.minimumLevel = options.minimumLevel ?? 'info';
    }

    /**
     * Creates a logger with additional fields included in every entry.
     *
     * @param fields Stable context for the child logger.
     * @returns A logger with the combined context.
     */
    public child(fields: LogFields): Logger {
        return new Logger({
            baseFields: { ...this.baseFields, ...fields },
            minimumLevel: this.minimumLevel,
        });
    }

    /**
     * Writes a debug-level event.
     *
     * @param event Stable event name.
     * @param message Human-readable event description.
     * @param fields Structured event fields.
     */
    public debug(event: string, message: string, fields: LogFields = {}): void {
        this.write('debug', event, message, fields);
    }

    /**
     * Writes an info-level event.
     *
     * @param event Stable event name.
     * @param message Human-readable event description.
     * @param fields Structured event fields.
     */
    public info(event: string, message: string, fields: LogFields = {}): void {
        this.write('info', event, message, fields);
    }

    /**
     * Writes a warning-level event.
     *
     * @param event Stable event name.
     * @param message Human-readable event description.
     * @param fields Structured event fields.
     */
    public warn(event: string, message: string, fields: LogFields = {}): void {
        this.write('warn', event, message, fields);
    }

    /**
     * Writes an error-level event.
     *
     * @param event Stable event name.
     * @param message Human-readable event description.
     * @param error Optional error to serialize into diagnostic fields.
     * @param fields Structured event fields.
     */
    public error(event: string, message: string, error?: unknown, fields: LogFields = {}): void {
        this.write('error', event, message, {
            ...fields,
            ...serializeError(error),
        });
    }

    private write(level: LogLevel, event: string, message: string, fields: LogFields): void {
        if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minimumLevel]) {
            return;
        }

        const entry: LogEntry = {
            event,
            fields: redactFields({ ...this.baseFields, ...fields }),
            level,
            message,
            timestamp: new Date().toISOString(),
        };

        const serializedEntry = JSON.stringify(entry);
        if (level === 'error') {
            console.error(serializedEntry);
        } else if (level === 'warn') {
            console.warn(serializedEntry);
        } else {
            console.log(serializedEntry);
        }
    }
}

export const logger = new Logger({ minimumLevel: getServerConfig().LOG_LEVEL });
