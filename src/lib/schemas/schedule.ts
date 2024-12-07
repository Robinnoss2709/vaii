import { z } from "zod";

export const scheduleSchema = z.object({
  subject: z.string().max(7, "Predmet môže mať maximálne 7 znakov"),
  teacher: z
    .string()
    .regex(/^\w+(\s+\w+)?$/, "Učiteľ musí obsahovať aspoň jedno alebo dve slová"),
  classroom: z.string().max(6, "Miestnosť môže mať maximálne 6 znakov"),
});
