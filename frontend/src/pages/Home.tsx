import { Header } from '@components/Header';
import { NewQuizForm } from '@components/NewQuizForm';

import { getGroups } from '@api/groups';
import type { Group } from '@api/types';

import { useEffect, useState } from 'react';

export function Home() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        getGroups().then(setGroups)
    }, [])

    return (
        <div className="Home Page">
            <Header pageTitle="Home" />
            <NewQuizForm groups={groups} />
        </div>
    )
}

