import { useEffect, useState } from 'react'
import { GameSettings, loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from '../lib/localStorage';
import PlayerCard from './player-card';
import { DEFAULT_ROLE } from '../constants/roles';

function PlayerTable() {
    const [settings, setSettings] = useState<GameSettings>({players: [], category: []});

    useEffect(() => {
        const sett = loadSettingsFromLocalStorage();
        if (sett) {
            setSettings(sett);
        }
    }  , []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const player = formData.get('playerName');
        try{
            if (!player){
                throw new Error('Player name is required');
            }
            if (settings.players.find((p) => p.name === player)){
                throw new Error('Player already exists');
            }
            const newSettings = {...settings, players: [...settings.players,
                {id: settings.players.length + 1,
                name: player as string,
                role: DEFAULT_ROLE}]};
            setSettings(newSettings);
            saveSettingsToLocalStorage(newSettings);
        }
        catch (Error){
            alert(Error);
        }
        finally{
            (e.currentTarget as HTMLFormElement).reset();
        }
    }

    const handleDelete = (id: number) => {
        const newSettings = {...settings, players: settings.players.filter((player) => player.id !== id)};
        setSettings(newSettings);
        saveSettingsToLocalStorage(newSettings);
    }

    const handleReset = () => {
        localStorage.removeItem('gameSettings');
        setSettings({players: [], category: []});
    }
    
    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-4 text-center">Añadir Jugadores</h2>
          <form className="flex flex-col sm:flex-row gap-2 mb-4" onSubmit={handleSubmit}>
            <input
              className="flex-grow border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="playerName"
              type="text"
              placeholder="Nombre del jugador"
            />
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
              type="submit"
            >
              Añadir
            </button>
          </form>
    
          <div className="border border-gray-300 rounded">
            <div className="p-2 border-b border-gray-300">
              <h3 className="text-white">Jugadores: {settings.players.length}</h3>
            </div>
            <div className="p-2 overflow-y-auto">
              {settings.players.map((player) => (
                <div key={player.id} className="mb-2">
                  <PlayerCard player={player} onDelete={() => handleDelete(player.id)} />
                </div>
              ))}
            </div>
          </div>
    
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
            onClick={handleReset}
          >
            Borrar Todo
          </button>
        </div>
      );
    }
    
    export default PlayerTable;