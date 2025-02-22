import { useState } from 'react';
import PlayerTable from './components/player-table'
import Screen from './components/screen';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './lib/localStorage';
import { Category, CategoryName, Player, Word } from './lib/types';
import { words } from './constants/words';
import CategorySelector from './components/category-selector';
import { DEFAULT_CATEGORIES } from './constants/categories';

const DEFAULT_SCREEN_COLOR = 'bg-fuchsia-900';

const getRandom = <T,>(arr: T[], filterFn?: (item: T) => boolean): T | undefined => {
  const filtered = filterFn ? arr.filter(filterFn) : arr;
  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const generateWord = (cat: Category[]): Word => {
  const filteredWords = words.filter((w) => getEnabledCategories(cat).includes(w.category));
  const index = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[index];
}

const getEnabledCategories = (cat: Category[]): CategoryName[] => {
  return cat.filter((c) => c.enabled).map((c) => c.name);
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
  return showCategory ? DEFAULT_CATEGORIES.find((c) => c.name === name)!.enabled_color : DEFAULT_SCREEN_COLOR;
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
    if(getEnabledCategories(categories).length < 1){
      alert('Error: debe seleccionar al menos una categoría para jugar.');
      return;
    }
    // GENERO NUEVA PALABRA
    setCurrentWord(generateWord(categories));

    // ASIGNO ROLES
    const playersWithRoles = generateRoles(sett.players);
    // actualizo jugadores
    setPlayers(playersWithRoles);
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

  if (playing && playerIndex >= players.length) {
    return (
      <div className={`w-full h-full flex flex-col min-h-screen ${DEFAULT_SCREEN_COLOR}`}>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md text-white p-6 rounded-lg text-center">
            <h2 className="py-4 text-xl font-bold">¡Que comience el juego!</h2>
            <h3 className="py-4">
              El primero en hablar debe ser{' '}
              <strong>{getRandom(players, (p) => p.role !== 'spy')?.name}</strong>.
            </h3>
            <button
              onClick={handleEndGame}
              className="bg-green-600 mt-4 p-2 rounded hover:bg-green-700"
            >
              Nueva partida
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-800">
      {playing ? (
        <Screen
          key={currentPlayer.id}
          word={currentWord}
          player={currentPlayer.name}
          role={currentPlayer.role}
          color={getColor(currentWord.category, showCategory)}
          onClick={handleNextScreen}
        />
      ) : (
        <main className="p-4">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-center">Espía bíblico</h1>
          <h6 className='text-gray-400 text-center'>by Juampi Morales</h6>
          <hr className="my-2" />
          <div className="flex flex-col gap-6">
            <section className="w-full">
              <PlayerTable />
            </section>
            <section className="w-full">
              <CategorySelector categories={categories} setCategories={setCategories} />
                <div className="flex items-center justify-center gap-2 mt-4">
                  <label className="text-gray-300">Mostrar color de categoría en partida</label>
                  <input
                    className="size-5"
                    type="checkbox"
                    checked={showCategory}
                    onChange={() => setShowCategory(!showCategory)}
                  />
                </div>
                </section>
              <section className="w-full flex justify-center">
                <button
                  className="bg-lime-500 px-6 py-2 rounded-md hover:bg-lime-600 transition-colors"
                  onClick={handleStartGame}
                >
                  <label className=' text-white font-bold'>COMENZAR</label>
                </button>
              </section>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;