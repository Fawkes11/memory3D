import { useGameStore } from './store/gameStore';
import { GameScreen } from './views/GameScreen';
import { HomeScreen } from './views/HomeScreen';
import { VictoryScreen } from './views/VictoryScreen';

function App() {
  const { gameState, gameStats, startGame, endGame, goHome } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {gameState === 'home' && <HomeScreen onStartGame={startGame} />}
      {gameState === 'playing' && <GameScreen onGameEnd={endGame} />}
      {gameState === 'victory' && (
        <VictoryScreen
          stats={gameStats}
          onPlayAgain={startGame}
          onGoHome={goHome}
        />
      )}
    </div>
  );
}

export default App;
