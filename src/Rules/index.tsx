import React from 'react';
import { Card } from 'react-bootstrap';
import './index.scss';

function Rules() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Rules</Card.Title>
      </Card.Header>
      <Card.Body>
        <ul className="rules-list">
          <li>At the start of the game, the user is presented with a grid of 24 facedown cards.</li>
          <li>Each card looks identical face down, but has a face-up value that is matched by only one other card on the table.</li>
          <li>When the user clicks a card, it flips over revealing its value.</li>
          <li>When the user clicks the next card, its value is revealed and then compared against the other face up card. If they are equal, both cards disappear. If they are different, they flip back down.</li>
          <li>The game is continued until there are no cards left.</li>
        </ul>
      </Card.Body>
    </Card>
  );
}

export default Rules;
