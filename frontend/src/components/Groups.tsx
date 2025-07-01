import type { Group, Question } from "@api/types";

import "./Groups.css";

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
    return (
        <li className="GroupItem" key={group.slug}>
            <div className="selected"><input type="checkbox" /></div>
            <div className="name">{group.name}</div>
            <QuestionList questions={group.questions} />
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
