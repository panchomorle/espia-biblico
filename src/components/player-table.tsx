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
        <div className='h-full flex flex-col justify-center items-center overflow-hidden'>
            <h2 className='font-bold p-2'>Añadir jugadores</h2>
            <div className='flex flex-col w-full max-w-md'>
                <form className='flex flex-col sm:flex-row gap-2 mb-4' onSubmit={handleSubmit}>
                    <input 
                        className='flex-grow border border-gray-400 p-2 rounded'
                        name="playerName"
                        type="text"
                        placeholder='Player name'
                    />
                    <button 
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded" 
                        type="submit"
                    >
                        Add
                    </button>
                </form>
                
                <div className='flex-1 flex flex-col overflow-hidden border border-gray-400 rounded min-h-0'>
                    <div className='p-2 border-b border-gray-400'>
                        <h3>Jugadores: {settings.players.length}</h3>
                    </div>
                    <div className='flex-1 max-h-64 overflow-y-auto p-2'>
                        {settings?.players.map((player) => (
                            <div key={player.id} className="mb-2">
                                <PlayerCard player={player} onDelete={() => handleDelete(player.id)} />
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={handleReset}
                >
                    Borrar todo
                </button>
            </div>
        </div>
    )
}

export default PlayerTable