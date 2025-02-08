import { Category, Player } from "./types";

const gameSettingsKey = 'gameSettings'

export type GameSettings = {
    players: Player[];
    category: Category[];
}

export const saveSettingsToLocalStorage = (gameSettings: GameSettings) => {
    localStorage.setItem(gameSettingsKey, JSON.stringify(gameSettings))
  }
  
  export const loadSettingsFromLocalStorage = () => {
    const sett = localStorage.getItem(gameSettingsKey)
    return sett ? (JSON.parse(sett) as GameSettings) : null
  }

