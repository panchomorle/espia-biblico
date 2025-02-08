
import { useState } from 'react';
import PlayerTable from './components/player-table'
import Screen from './components/screen';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './lib/localStorage';
import { Category, Player, Word } from './lib/types';
import { words } from './constants/words';

const getRandom = <T,>(arr: T[], filterFn?: (item: T) => boolean): T | undefined => {
  const filtered = filterFn ? arr.filter(filterFn) : arr;
  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const generateWord = (cat: Category[]): Word => {
  const filteredWords = words.filter((w) => cat.includes(w.category));
  const index = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[index];
}

const generateRoles = (players: Player[]): Player[] => {
  const index = Math.floor(Math.random() * players.length);
  return players.map((p, i) => {
    if (i === index) {
      return {...p, role: 'spy'};
      }
    return {...p, role: 'player'};
    });
  }


function App() {
  const [playing, setPlaying] = useState(false);
  const [categories, setCategories] = useState<Category[]>(
    ['comidas', 'personajes', 'lugares', 'objetos', 'animales']);
  const [currentWord, setCurrentWord] = useState<Word>({word: 'no word', category: 'comidas'});
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);

  const handleStartGame = () => {
    const sett = loadSettingsFromLocalStorage();
    if (!sett) {
      alert('Error: no se crearon configuraciones de partida.');
      return;
    }
    if(sett.players.length < 3){
      alert('Error: se necesitan al menos 3 jugadores para jugar.');
      return;
    }
    // GENERO NUEVA PALABRA
    setCurrentWord(generateWord(categories));

    // ASIGNO ROLES
    const playersWithRoles = generateRoles(sett.players);
    // actualizo jugadores
    setPlayers(playersWithRoles);
    console.log(players);
    // actualizo localStorage
    const newSettings = {...sett, players: playersWithRoles}; 
    saveSettingsToLocalStorage(newSettings);


    setPlaying(true);
  }

  const handleEndGame = () => {
    setPlaying(false);
    setPlayerIndex(0);
  }

  const handleNextScreen = () => {
    setPlayerIndex(playerIndex + 1);
  }

  if(playing && playerIndex >= players.length){
    return (
      <div className='w-screen h-screen justify-center items-center text-center'>
        <div className='w-full h-full bg-fuchsia-900 text-white p-8 flex flex-col justify-center items-center'>
          <h2 className="py-4">¡Que comience el juego!</h2>
          <h3 className='py-4'> El primero en hablar debe ser <strong>{getRandom(players, (p) => p.role !== 'spy')?.name}</strong>.</h3>
          <button onClick={handleEndGame} className="bg-green-600 mt-4 p-2">
            Nueva partida
          </button>
        </div>
      </div>
    )
  }

  const currentPlayer = players[playerIndex];

  return (
    <>
      { playing ?
        <Screen
          key={currentPlayer.id}
          word={currentWord}
          player={currentPlayer.name}
          role={currentPlayer.role}
          onClick={handleNextScreen}/>
        :
        <>
        <PlayerTable />
        <button className='bg-lime-500' onClick={handleStartGame}>START</button>
        </>
      }
      
      
    </>
  )
}

export default App
