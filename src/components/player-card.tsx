import { Player } from "../lib/types";

interface PlayerCardProps {
    player: Player;
    onDelete: () => void;
}

function PlayerCard({ player, onDelete }: PlayerCardProps) {

  return (
    <div className="flex items-center justify-between p-4 border-b">
        <h2>{player.name}</h2>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded" onClick={onDelete}>X</button>
    </div>
  )
}

export default PlayerCard