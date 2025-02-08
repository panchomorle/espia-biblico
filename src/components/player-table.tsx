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
    <div>
        <h2>Add players</h2>
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                className='border border-gray-400 p-2'
                name="playerName" type="text" placeholder='Player name'/>
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded" type="submit">Add</button>
            </form>
            <div>
                <div>
                    <div>
                        <h3>Players</h3>
                    </div>
                </div>
                <div className=''>
                    {settings?.players.map((player) => (
                        <div key={player.id}>
                            <PlayerCard player={player} onDelete={()=> handleDelete(player.id)} />
                        </div>
                    ))}
                </div>
            </div>
            <button className="my-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}>Delete All</button>
        </div>

    </div>
  )
}

export default PlayerTable