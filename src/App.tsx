import React from 'react';

import Game from './Game';

import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Game</h1>
      </header>
      <main className="app-main">
        <Game />
      </main>
      <footer>
        
      </footer>
    </div>
  );
}

export default App;
