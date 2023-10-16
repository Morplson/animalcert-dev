import './App.css';

import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/layout/Layout";
import Home from "./pages/Home";
import Nft from "./pages/Nft";
import ShowAll from './pages/migrated views/ShowAll';
import NoPage from "./pages/NoPage";

import AnimalDetails from './pages/migrated views/AnimalDetails';
import AnimalsByOwner from './pages/migrated views/AnimalsByOwner';
import AnimalPedigree from './pages/migrated views/AnimalPedigree';

import { Web3Context, Web3Data } from './deprecated/Web3Context';
import MintAnimal from './pages/migrated views/MintAnimal';


class App extends Component {
    state = {
        web3data: new Web3Data(),
    }    
    
    setWeb3data = data => {
        this.setState({ web3data: data });
    };
    
    async componentDidMount() {
        let data = await this.state.web3data.updateAddressAsync();
        this.setWeb3data(data);
        
        this.forceUpdate();
    }        
    
    render(){
        let context = this.state;
        context.setWeb3data = this.setWeb3data;
        
        
        
        return (
        <Web3Context.Provider value={context}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home web3={this.state.web3data.web3} contract={this.state.web3data.contract} />} />
                        <Route path="nft" element={<Nft  web3={this.state.web3data.web3}/>} />
                        <Route path="animals">
                            <Route index exact element={<ShowAll web3={this.state.web3data.web3} contract={this.state.web3data.contract}/>} />
                            <Route path="new" exact element={<MintAnimal />} />
                            <Route path=":id" element={<AnimalDetails web3={this.state.web3data.web3} contract={this.state.web3data.contract}/>} />
                        </Route>
                        <Route path="owner/:id" element={<AnimalsByOwner web3={this.state.web3data.web3} contract={this.state.web3data.contract}/>} />
                        <Route path="ancestry/:id" element={<AnimalPedigree web3={this.state.web3data.web3} contract={this.state.web3data.contract}/>} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Web3Context.Provider>
        );
    }

    
}

export default App;
