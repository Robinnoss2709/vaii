import { z } from 'zod';

export const scheduleSchema = z.object({
    subject: z.string().max(7, "Predmet môže mať maximálne 7 znakov"),
    teacher: z
        .string().max(20, "Učiteľ môže mať maximálne 20 znakov")
        .regex(/^\w+(\s+\w+)?$/, "Učiteľ musí mať iba meno alebo aj priezvisko"),
    classroom: z.string().max(6, "Miestnosť môže mať maximálne 6 znakov"),
});

export type ValidationError = z.ZodError['errors'][number];