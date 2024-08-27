import React, { useState } from 'react';
import './CharacterSelection.css';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


const CharacterSelection = ({ charList, ws, gameId, playerId}) => {
  const [characterList, setCharacterList] = useState(charList);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value.toUpperCase());
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const validCharacters = ['P', 'H1', 'H2'];
    const characters = inputValue.split(',').map(name => name.trim());
    const filteredCharacters = characters.filter(name => validCharacters.includes(name));

    if (filteredCharacters.length == characters.length && characters.length == 5) {
      console.log("success")
      ws.send(JSON.stringify({ type: 'setChars', gameId,playerId,characters : filteredCharacters }));
    } 
    else if(filteredCharacters.length == characters.length && characters.length > 5){
      toast.error("Only 5 Characters are allowed.", {
        duration: 1500
      });
    }
    else if(filteredCharacters.length == characters.length && characters.length < 5){
      toast.error("Enter 5 Characters .", {
        duration: 1500
      });
    }
    else {
      toast.error("Please enter valid characters: P, H1, or H2.", {
        duration: 1500
      });
    }
  };

  return (
    <div className="board-wrapper">
      <h1>Character Grid</h1>
      <form onSubmit={handleFormSubmit} className="character-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter character names separated by commas"
          className="character-input"
        />
        <button type="submit" className="character-submit-button">Submit</button>
      </form>
      <div className="available-characters">
        <h2>Available Characters</h2>
        <div className="character-grid">
          {characterList.length > 0 ? characterList.map((character, index) => (
            <div key={index} className="character-grid-item">
              {character}
            </div>
          )) : <p>No characters available.</p>}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default CharacterSelection;




