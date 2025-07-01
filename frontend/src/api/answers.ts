import type { AxiosResponse } from 'axios';
import { api } from './client';

import type { Answer, CreateAnswer } from '@api/types';

export const getAnswers = () =>
    api.get<[Answer]>('answers').then((res) => res.data)

export const getAnswer = (id: number) =>
    api.get<Answer>(`answers/${id}`).then((res) => res.data)

export const createQuiz = (answer: CreateAnswer) =>
    api.post<Answer, AxiosResponse<Answer>, Answer>('answers/', answer).then((res) => res.data)

