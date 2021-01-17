import React from 'react';

import Game from './Game';

import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Frozen Memory Game</h1>
      </header>
      <main className="app-main">
        <Game />
      </main>
      <footer>
        <span className="float-right mr-2">Create by Jamil Shehadeh</span>
      </footer>
    </div>
  );
}

export default App;
