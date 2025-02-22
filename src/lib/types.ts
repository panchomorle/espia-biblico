import { CATEGORY_NAMES } from '../constants/categories';
import { ROLES } from '../constants/roles';

export type Role = typeof ROLES[number];

export type Player = {
    id: number;
    name: string;
    role: Role;
}

export type CategoryName = typeof CATEGORY_NAMES[number];

export type Category = {
    name: CategoryName;
    enabled_color: string;
    disabled_color: string;
    enabled: boolean;
}


export type Word = {
    word: string;
    category: CategoryName;
}

