import type { Group, Question } from "@api/types";

import "./Groups.css";
import { useState } from "react";

interface QuestionItemProps {
    question: Question;
    selected: boolean;
    handleSelect: (ids: number[]) => void;
}

export function QuestionItem({ question, selected, handleSelect }: QuestionItemProps) {
    return (
        <li className="QuestionItem">
            <div className="selected"><input type="checkbox" checked={selected} onChange={() => handleSelect([question.id])} /></div>
            <span className="text">{question.text}</span>
        </li>
    )
}

interface QuestionListProps {
    questions: Question[];
    selected: Set<number>;
    handleSelect: (ids: number[]) => void;
}

export function QuestionList({ questions, selected, handleSelect }: QuestionListProps) {
    return (
        <ul className="QuestionList">
            {
                questions.map((question: Question) => <QuestionItem key={question.id} question={question} selected={selected.has(question.id)} handleSelect={handleSelect} />)
            }
        </ul>
    )
}

interface GroupItemProps {
    group: Group;
    selected: Set<number>;
    handleSelect: (ids: number[]) => void;
}

export function GroupItem({ group, selected, handleSelect }: GroupItemProps) {
    const [open, setOpen] = useState<boolean>(true);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <li className={`GroupItem ${open ? "open" : "closed"}`}
            key={group.slug}
        >
            <div className="selected"><input type="checkbox" /></div>
            <div className="name"
                onClick={() => toggleOpen()}
            >{group.name}</div>
            {
                open && <QuestionList questions={group.questions} selected={selected} handleSelect={handleSelect} />
            }
        </li >
    )
}

interface GroupListProps {
    groups: Group[];
}

export function GroupList({ groups }: GroupListProps) {
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
        console.log(newSelected);
    }

    return (
        <ul className="GroupList">
            {
                groups.map((group: Group) => <GroupItem key={group.slug} group={group} selected={selected} handleSelect={handleSelect} />)
            }
        </ul>
    )
}
