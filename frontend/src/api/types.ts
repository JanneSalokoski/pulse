export interface Answer {
    value: number;
}

export interface CreateAnswer {
    value: number;
    question_id: number;
    quiz_id: number;
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
    id: number;
    name: string;
    slug: string;
    created_at: string;
    questions?: Question[];
}

export interface CreateQuiz {
    name: string;
    questions: number[];
}
