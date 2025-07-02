import type { Question, Quiz } from "@api/types"

import "./Quiz.css";
import { useState } from "react";

interface RangeInputProps {
    value: number | undefined;
    name: number | string;
    onSelect: (value: number) => void;
}

function RangeInput({ value, name, onSelect }: RangeInputProps) {
    return (
        <fieldset className="RangeInput">
            {[...Array(10)].map((_, i) => {
                const val = i + 1;
                return (
                    <label key={val}>
                        <span className="label">{val}</span>
                        <input
                            type="radio"
                            name={`range-${name}`}
                            value={val}
                            checked={value === val}
                            onChange={() => onSelect(val)}
                        />
                    </label>
                );
            })}
        </fieldset>
    )
}

interface QuestionProps {
    question: Question;
    handleSelect: (question_id: number, value: number) => void;
    selected: number | undefined;
}

function QuestionItem({ question, selected, handleSelect }: QuestionProps) {
    return (
        <div className="Question">
            <span className="text">{question.text}</span>
            <RangeInput value={selected} name={question.id} onSelect={(value: number) => handleSelect(question.id, value)} />
        </div>
    )
}

interface QuizProps {
    quiz: Quiz
}

export function QuizItem({ quiz }: QuizProps) {
    const [selections, setSelections] = useState<Map<number, number>>(() => new Map());

    function handleSelection(question_id: number, value: number) {
        let newSelections = new Map(selections);
        newSelections.set(question_id, value);
        setSelections(newSelections);
    }

    return (
        <div className="Quiz">
            <h2>{quiz.name}</h2>
            <a href={`/q/${quiz.slug}`}><h3>{`/q/${quiz.slug}`}</h3></a>
            <div className="questions">
                {
                    quiz?.questions?.map((q: Question) => <QuestionItem question={q} handleSelect={handleSelection} selected={selections.get(q.id)} />)
                }
            </div>

        </div>
    )
}
