import { getQuiz } from "@api/quizzes";
import type { Quiz } from "@api/types";
import { Header } from "@components/Header";
import { QuizItem } from "@components/Quiz";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useVisitorCount(slug: string) {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const ws = new WebSocket(`ws://${location.host}/api/quizzes/ws/${slug}`);

        ws.onmessage = (event) => {
            setCount(Number(event.data));
        };

        return () => {
            ws.close();
        };
    }, [slug]);

    return count;
}

export function QuizPage() {

    const { slug } = useParams<{ slug: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    const count = useVisitorCount(slug || "");

    useEffect(() => {
        if (!slug) return;

        getQuiz(slug).then(setQuiz).catch(console.error);
    }, [slug])

    return (
        <div className="Quiz Page">
            <Header pageTitle={quiz?.name || ""} />
            {
                quiz ? <QuizItem quiz={quiz} visitors={count} /> : <></>
            }
        </div>
    )
}
