import { getQuiz } from "@api/quizzes";
import type { Quiz, Question } from "@api/types";
import { Header } from "@components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function QuizPage() {

    const { slug } = useParams<{ slug: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        if (!slug) return;

        getQuiz(slug).then(setQuiz).catch(console.error);
    }, [slug])

    return (
        <div className="Quiz Page">
            <Header pageTitle={quiz?.name || ""} />
            <ul>
                {
                    quiz?.questions?.map((q: Question) => (
                        <li key={q.id}>{q.text}</li>
                    ))
                }
            </ul>
        </div>
    )
}
