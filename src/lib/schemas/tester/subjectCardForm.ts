import { z } from 'zod';

export const subjectCardSchema = z.object({
    name: z.string().min(1, 'Názov predmetu je povinný.'),
    study: z.string().min(1, 'Vyberte štúdium.'),
    year: z.union([
        z.number().min(1, 'Vyberte ročník.'),
        z.null() // Povolenie null ako prípustnej hodnoty
    ]).refine((value) => value !== null, {
        message: 'Vyberte ročník.'
    }),
    semester: z.string().min(1, 'Vyberte semester.'),
    fields: z.array(z.string()).min(1, 'Vyberte aspoň jeden odbor.'),
    link: z.string().min(1, 'Zadajte platný odkaz.'),
});
