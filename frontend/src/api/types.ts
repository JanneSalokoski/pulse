export interface Answer {
    value: number;
}

export interface Question {
    id: number;
    group_id: number;
    text: string;

    answers?: Answer[];
}

export interface Group {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    questions?: Question[];
}

export interface Quiz {
    name: string;
    slug: string;
    created_at: string;
    questions?: Question[];
}

export interface CreateQuiz {
    name: string;
    questions: number[];
}
