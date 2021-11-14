import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import wind from '../../assets/wind.svg';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../constants';
import myEpicGame from '../../utils/MyEpicGame.json';


const SelectCharacter = ({ setCharacterNFT }) => {

  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  // Call smart contract to display mint-able characters when page loaded
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );


      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);


  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');

        /* Call contract to get all mint-able characters */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        /*Go through all of our characters and transform the data*/
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        /*Set all mint-able characters in state*/
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    /*Add a callback method that will fire when this event is received
    This method is called anytime a new character NFT is minted*/
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*Once our character NFT is minted we can fetch the metadata from our contract
      and set it in state to move onto the Arena*/
      if (gameContract) {
        // All metadate will be obtained by calling this ⇩ function
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();

      //Setup NFT Minted Listener
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      if (gameContract) {
        // to stop listening to this event when the component is not being used anymore
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  }, [gameContract]);

  
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`)
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };

  /*map through all of our characters and create some UI 
  to render them on the page.*/
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Master 🐱‍🏍<img alt="Wind Animated" className="twitter-logo" src={wind} />. Choose wisely!</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  );
};

export default SelectCharacter;