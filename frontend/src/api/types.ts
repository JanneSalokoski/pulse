export interface Question {
    id: number;
    group_id: number;
    text: string;
}

export interface Group {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    questions: Question[];
}
