import { useState } from "react";
import { Role, Word } from "../lib/types";

interface ScreenProps{
    word: Word;
    player: string;
    role: Role;
    onClick: () => void;
}

function Screen({ word, player, role, onClick}: ScreenProps) {
    const [toggled, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggled);
    }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-center">
    { toggled ? 
        <button onClick={onClick} className="w-full h-full bg-fuchsia-900 text-white p-8">
        <h2 className="align-text-top">{player}</h2>
        {
            role === 'player' ?
            <h1 className="">{word.word}</h1>
            :
            <h1 className="text-white font-bold">Eres un espía</h1>
        }
        <h3>Hacé click para pasar a la siguiente persona.</h3>
        </button>
    :
        <button onClick={handleToggle} className="w-full h-full bg-fuchsia-900 text-white p-8">
        <h2 className="">{player}</h2>
        <h3>Hacé click para ver qué sos.</h3>
        </button>
    }
    </div>
  )
}

export default Screen