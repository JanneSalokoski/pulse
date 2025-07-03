import { getQuiz } from "@api/quizzes";
import type { Quiz } from "@api/types";
import { Header } from "@components/Header";
import { QuizItem } from "@components/Quiz";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface EventMessage {
    event: string;
    payload: Record<string, string | number>;
}

export function useQuizWebSocket(slug: string) {
    const [participantCount, setParticipantCount] = useState<number>(0);
    const [answerCount, setAnswerCount] = useState<number>(0);

    useEffect(() => {
        const socket = new WebSocket(`ws://${window.location.host}/api/quizzes/ws/${slug}`);

        console.log(socket);

        socket.onmessage = (event) => {
            console.log("WS raw message", event.data);
            try {
                const data: EventMessage = JSON.parse(event.data);

                switch (data.event) {
                    case "participant_amount":
                        setParticipantCount(Number(data.payload.amount));
                        break;

                    case "answer_amount":
                        setAnswerCount(Number(data.payload.amount));
                        break;

                    default:
                        console.warn("Unknown websocket event", data);
                }
            } catch (err) {
                console.error("Error parsing WS message", err);
            }
        };

        socket.onclose = (event) => {
            console.log("WebSocket closed", event.code, event.reason);
        }

        socket.onerror = (err) => {
            console.error("WebSocket error", err);
        }

        return () => {
            socket.close();
        };
    }, [slug]);

    return { participantCount, answerCount };
}

export function QuizPage() {

    const { slug } = useParams<{ slug: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    const { participantCount, answerCount } = useQuizWebSocket(slug || "");

    useEffect(() => {
        if (!slug) return;

        getQuiz(slug).then(setQuiz).catch(console.error);
    }, [slug])

    return (
        <div className="Quiz Page">
            <Header pageTitle={quiz?.name || ""} />
            {
                quiz ? <QuizItem quiz={quiz} participants={participantCount} answers={answerCount} /> : <></>
            }
        </div>
    )
}
