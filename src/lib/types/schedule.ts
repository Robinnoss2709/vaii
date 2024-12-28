export type ScheduleItem = {
    id: number;  // Make id required, not optional
    day: string;
    hour: string;
    subject: string;
    teacher: string;
    classroom: string;
    type: 'lecture' | 'exercise';  // Use literal types
    color: string;
    user_id: string;
};

export type FormData = Omit<ScheduleItem, 'id' | 'user_id'> & {
    id?: number;
    user_id?: string;
};