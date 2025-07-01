import { Home } from '@pages/Home';
import { QuizPage } from '@pages/Quiz';

import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/q/:slug',
        element: <QuizPage />
    }
])

function App() {
    return <RouterProvider router={router} />;
}

export default App
