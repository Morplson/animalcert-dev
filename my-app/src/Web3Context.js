import { createContext } from 'react';
import Web3 from 'web3';

import CONTRACT_ABI from './abis/AnimalCertificate.json';


export class Web3Data{
    constructor(){
        this.web3 = null;
        this.address = null;
        this.contract = null;
        
        this.defaults();
    }
    
    defaults(){
        let provider;
        if (window.ethereum && window.ethereum.selectedAddress) {
            provider = new Web3(window.ethereum);
            
        } else {
            provider = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/5f544c19cfab4eb09869cab2a266d6f7'));
        }
        this.web3 = provider;
        
        this.updateContract();
        
        return this;
    }
    
    //const contractAddress = '0xFe05a9212E9FB33e68b9864C52D2029E2Ea04ce6';
    updateContract(){
        const contractAddress = '0xb88D94FD88a7EFee0637918392C693695B6EE047';
        const newContract = new this.web3.eth.Contract(CONTRACT_ABI.abi, contractAddress);
        this.contract = newContract;
        console.log("Updated contract");
    }
    
    async updateAddressAsync(){
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
        this.address = accounts[0];
    
        return this;
    }
    
    
    
    async connectWallet(){
        console.log("c: ", this)
        if (window.ethereum) {
            await window.ethereum.enable();
            const provider = new Web3(window.ethereum);
            this.web3 = provider;

            const accounts = await this.web3.eth.getAccounts();
            console.log(accounts);
            this.address = accounts[0];
        } else if (window.web3) {
            const provider = new Web3(window.web3.currentProvider);
            this.web3 = provider;
        }
        
        this.web3.currentProvider.on('disconnect', this.defaults.bind(this) );
        
        this.updateContract();
        
        console.log("c_data: ", this)
        
        return this;
    }
    
};

export const Web3Context = createContext();
