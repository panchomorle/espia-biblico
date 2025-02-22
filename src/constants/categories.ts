import { Category } from "../lib/types";

export const CATEGORY_NAMES = ['objetos',
    'animales', 'personajes', 'lugares', 'comidas'] as const;

export const DEFAULT_CATEGORIES: Category[] =
    [
        {
            name: 'objetos',
            enabled_color: 'bg-blue-500',
            disabled_color: 'bg-blue-200',
            enabled: true
        },
        {
            name: 'animales',
            enabled_color: 'bg-green-500',
            disabled_color: 'bg-green-200',
            enabled: true
        },
        {
            name: 'personajes',
            enabled_color: 'bg-red-500',
            disabled_color: 'bg-red-200',
            enabled: true
        },
        {
            name: 'lugares',
            enabled_color: 'bg-yellow-500',
            disabled_color: 'bg-yellow-200',
            enabled: true
        },
        {
            name: 'comidas',
            enabled_color: 'bg-violet-500',
            disabled_color: 'bg-violet-200',
            enabled: true
        },
    ]