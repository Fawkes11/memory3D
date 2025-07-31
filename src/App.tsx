import { useGameStore } from './store/gameStore';
import { HomeScreen } from './views/HomeScreen';

function App() {
  const { gameState, startGame } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {gameState === 'home' && <HomeScreen onStartGame={startGame} />}
      
      
    </div>
  );
}

export default App;
