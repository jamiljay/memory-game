import React from 'react';
import { Container } from 'react-bootstrap';

import Game from './Game';
// import Rules from './Rules';

import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Game</h1>
      </header>
      <main className="app-main">
        <Container>
          <Game />
        </Container>
      </main>
      <footer>
        
      </footer>
    </div>
  );
}

export default App;
