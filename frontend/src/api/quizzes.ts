import type { AxiosResponse } from 'axios';
import { api } from './client';

import type { Quiz, CreateQuiz } from '@api/types';

export const getQuizzes = () =>
    api.get<Quiz[]>('quizzes').then((res) => res.data)

export const getQuiz = (slug: string) =>
    api.get<Quiz>(`quizzes/${slug}`).then((res) => res.data)

export const createQuiz = (quiz: CreateQuiz) =>
    api.post<Quiz, AxiosResponse<Quiz>, CreateQuiz>('quizzes/', quiz).then((res) => res.data)

