import React, { useState, useEffect } from 'react';
import CONTRACT_ABI from '../abis/AnimalCertificate.json';

const Nft = ({ web3, match }) => {
  const [blockHeight, setBlockHeight] = useState(null);

  useEffect(() => {
    async function getBlockHeight() {
      const height = await web3.eth.getBlockNumber();
      setBlockHeight(height);
    }
    getBlockHeight();
    const intervalId = setInterval(() => {
      getBlockHeight();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  
    return (
      <div>
        <h1>Current Block Height: {blockHeight}</h1>
      </div>
    );
  };
  
  export default Nft;