import type { AxiosResponse } from 'axios';
import { api } from './client';

import type { Quiz, CreateQuiz } from '@api/types';

export const getGroups = () =>
    api.get<Quiz[]>('quizzes').then((res) => res.data)

export const createQuiz = (quiz: CreateQuiz) =>
    api.post<Quiz, AxiosResponse<Quiz>, CreateQuiz>('quizzes/', quiz).then((res) => res.data)

