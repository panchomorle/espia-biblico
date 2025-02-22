import { useState } from 'react';
import PlayerTable from './components/player-table'
import Screen from './components/screen';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './lib/localStorage';
import { Category, CategoryName, Player, Word } from './lib/types';
import { words } from './constants/words';
import CategorySelector from './components/category-selector';
import { DEFAULT_CATEGORIES } from './constants/categories';

const getRandom = <T,>(arr: T[], filterFn?: (item: T) => boolean): T | undefined => {
  const filtered = filterFn ? arr.filter(filterFn) : arr;
  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const generateWord = (cat: Category[]): Word => {
  const enabled_categories = cat.map((c) => c.enabled && c.name) as CategoryName[];
  const filteredWords = words.filter((w) => enabled_categories.includes(w.category));
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

const getColor = (name: CategoryName, showCategory: boolean): string => {
  return showCategory ? DEFAULT_CATEGORIES.find((c) => c.name === name)!.enabled_color : 'bg-fuchsia-600';
}


function App() {
  const [playing, setPlaying] = useState(false);
  //El estado de las categorias es manejado por el componente padre
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [currentWord, setCurrentWord] = useState<Word>({word: 'no word', category: 'comidas'});
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [showCategory, setShowCategory] = useState<boolean>(false);

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

  const currentPlayer = players[playerIndex];

   if(playing && playerIndex >= players.length) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='w-full bg-fuchsia-900 text-white p-8 flex flex-col items-center'>
          <h2 className="py-4">¡Que comience el juego!</h2>
          <h3 className='py-4'> El primero en hablar debe ser <strong>{getRandom(players, (p) => p.role !== 'spy')?.name}</strong>.</h3>
          <button onClick={handleEndGame} className="bg-green-600 mt-4 p-2">
            Nueva partida
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full flex flex-col sm:flex-row overflow-hidden'>
      { playing ? (
        <Screen
          key={currentPlayer.id}
          word={currentWord}
          player={currentPlayer.name}
          role={currentPlayer.role}
          color={getColor(currentWord.category, showCategory)}
          onClick={handleNextScreen}
        />
      ) : (
        <main className='flex-1 p-4 overflow-hidden'>
          <div className='h-full container mx-auto flex flex-col'>
            <div className='flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden items-center justify-center'>
              {/* Player Table Container */}
              <div className='flex-1 min-w-0 overflow-hidden mt-96 sm:mt-0'>
                <PlayerTable />
              </div>
              
              {/* Category Selector Container */}
              <div className='flex-1 min-w-0 overflow-y-auto'>
                <CategorySelector categories={categories} setCategories={setCategories} />
                <div className='flex items-center justify-center gap-2 mt-4'>
                  <label>Mostrar color de categoría</label>
                  <input 
                    className='size-5' 
                    type="checkbox" 
                    checked={showCategory} 
                    onChange={() => setShowCategory(!showCategory)}
                  />
                </div>
              </div>
            </div>
            
            <div className='mt-4 flex justify-center'>
              <button 
                className='bg-lime-500 px-6 py-2 rounded-md hover:bg-lime-600 transition-colors'
                onClick={handleStartGame}
              >
                COMENZAR
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
