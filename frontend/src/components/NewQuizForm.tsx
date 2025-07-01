import { useState } from "react";

import { Input } from "@components/Input";
import { GroupList } from "@components/Groups";

import type { Group } from "@api/types";

import "./NewQuizForm.css";

interface NewQuizFormProps {
    groups: Group[];
}

export function NewQuizForm({ groups }: NewQuizFormProps) {
    const [quizTitle, setQuizTitle] = useState<string>("");

    return (
        <form className="NewQuizForm">
            <Input
                type="text"
                name="quizTitle"
                label="Name of the quiz"
                placeholder="3. sprintin pulssi"
                value={quizTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)}
            />
            <GroupList groups={groups} />
        </form>
    )
}
