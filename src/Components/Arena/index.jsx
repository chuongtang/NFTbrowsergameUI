import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';


const Arena = ({ characterNFT }) => {
 
  const [gameContract, setGameContract] = useState(null);
  const [demon, setDemon] = useState(null);

  
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
     
      <p>Demon GOES HERE</p>

      {/* Character NFT */}
      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;