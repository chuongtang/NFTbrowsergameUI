import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';


const Arena = ({ characterNFT }) => {

  const [gameContract, setGameContract] = useState(null);
  const [demon, setDemon] = useState(null);

  const runAttackAction = async () => {};

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
    /*Setup async function that will get the Demon from our contract*/
    const fetchDemon = async () => {
      const demonTxn = await gameContract.getDemon();
      console.log('Demon:', demonTxn);
      setDemon(transformCharacterData(demonTxn));
    };

    if (gameContract) {

      fetchDemon();
    }
  }, [gameContract]);

  return (
    <div className="arena-container">
      {demon && (
        <div className="boss-container">
          <div className={`boss-content`}>
            <h2>🔥 {demon.name} 🔥</h2>
            <div className="image-content">
              <img src={demon.imageURI} alt={`Demon ${demon.name}`} />
              <div className="health-bar">
                <progress value={demon.hp} max={demon.maxHp} />
                <p>{`${demon.hp} / ${demon.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${demon.name}`}
            </button>
          </div>
        </div>
      )}

{characterNFT && (
      <div className="players-container">
        <div className="player-container">
         
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
          <h2>Your Character</h2>
        </div>
      </div>
    )}
  </div>
  );
};

export default Arena;