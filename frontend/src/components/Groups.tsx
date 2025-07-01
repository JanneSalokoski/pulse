import type { Group, Question } from "@api/types";

import "./Groups.css";
import { useState } from "react";

interface QuestionItemProps {
    question: Question;
}

export function QuestionItem({ question }: QuestionItemProps) {
    return (
        <li className="QuestionItem">
            <input type="checkbox" />
            <span className="text">{question.text}</span>
        </li>
    )
}

interface QuestionListProps {
    questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
    return (
        <ul className="QuestionList">
            {
                questions.map((question: Question) => <QuestionItem question={question} />)
            }
        </ul>
    )
}

interface GroupItemProps {
    group: Group;
}

export function GroupItem({ group }: GroupItemProps) {
    const [open, setOpen] = useState<boolean>(true);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <li className={`GroupItem ${open ? "open" : "closed"}`}
            key={group.slug}
            onClick={() => toggleOpen()}
        >
            <div className="selected"><input type="checkbox" /></div>
            <div className="name">{group.name}</div>
            {
                open && <QuestionList questions={group.questions} />
            }
        </li>
    )
}

interface GroupListProps {
    groups: Group[];
}

export function GroupList({ groups }: GroupListProps) {
    console.log(groups);
    return (
        <ul className="GroupList">
            {
                groups.map((group: Group) => <GroupItem group={group} />)
            }
        </ul>
    )
}
