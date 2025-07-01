import './App.css'

import { Header } from '@components/Header';
import { NewQuizForm } from '@components/NewQuizForm';

import { getGroups } from '@api/groups';
import type { Group } from '@api/types';

import { useEffect, useState } from 'react';

function App() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        getGroups().then(setGroups)
    }, [])

    return (
        <div className="App">
            <Header pageTitle="" />
            <NewQuizForm groups={groups} />
        </div>
    )
}

export default App
