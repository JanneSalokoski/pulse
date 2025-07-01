import { useState } from "react";

import { Input } from "@components/Input";
import { GroupList } from "@components/Groups";

import type { CreateQuiz, Group, Quiz } from "@api/types";

import "./NewQuizForm.css";
import { createQuiz } from "@api/quizzes";
import { useNavigate } from "react-router-dom";

interface NewQuizFormProps {
    groups: Group[];
}

export function NewQuizForm({ groups }: NewQuizFormProps) {
    const [quizTitle, setQuizTitle] = useState<string>("");
    const [selected, setSelected] = useState<Set<number>>(() => new Set());

    function handleSelect(ids: number[]) {
        let newSelected = new Set(selected);
        for (const id of ids) {
            if (selected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
        }

        setSelected(newSelected);
    }

    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (selected.size !== 0 && quizTitle.length !== 0) {
            const payload: CreateQuiz = { name: quizTitle, questions: [...selected] };

            const res: Quiz = await createQuiz(payload);
            console.log(`/q/${res.slug}`);
            navigate(`/q/${res.slug}`);
        }
    }

    return (
        <form className="NewQuizForm" onSubmit={handleSubmit}>
            <Input
                type="text"
                name="quizTitle"
                label="Name of the quiz"
                placeholder="3. sprintin pulssi"
                value={quizTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)}
            />
            <GroupList groups={groups} selected={selected} handleSelect={handleSelect} />
            <input type="submit" value="Create quiz" disabled={selected.size === 0 || quizTitle.length === 0} />
        </form>
    )
}
