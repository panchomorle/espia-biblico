import { ROLES } from '../constants/roles';

export type Role = typeof ROLES[number];

export type Player = {
    id: number;
    name: string;
    role: Role;
}

export type Category = 'objetos' | 'animales' | 'personajes' | 'lugares' | 'comidas';

export type Word = {
    word: string;
    category: Category;
}

