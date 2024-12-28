import type { ValidationError } from '$lib/validation/scheduleSchema';

export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
    return errors.reduce((acc, err) => {
        acc[err.path[0] as string] = err.message;
        return acc;
    }, {} as Record<string, string>);
}