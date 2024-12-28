export type SubjectCard = {
    id: number;
    name: string;
    study: string;
    fields: string[];
    year: number | null;
    semester: string;
    link: string;
};

export type FormData = Omit<SubjectCard, 'id'> & {
    id?: number;
};