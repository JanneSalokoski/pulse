import { api } from './client';

import type { Group } from '@api/types';

export const getGroups = () =>
    api.get<Group[]>('/groups').then((res) => res.data)
