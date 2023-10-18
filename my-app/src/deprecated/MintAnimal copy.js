import React, { Component } from 'react';
import * as AnimalMaps from '../constants'
import { Web3Context, Web3Data } from '../../Web3Context';
import RadialMenu from '../pages/bits/RadialMenu';

class MintAnimal extends Component{
  static contextType = Web3Context;

  constructor(props) {
    super(props);
    this.diseases = [];
  }

  handleSelectChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => parseInt(option.value));
    this.diseases = selectedValues;
    console.log(this.diseases);
  };
  
  mint = (gender, species, breed, birthdate, diseases, furColor) => {
    let contract = this.context.web3data.contract;
    let account = this.context.web3data.address;
    contract.methods.mint(gender, species, breed, birthdate, diseases, furColor).send({ from: account })
    .once('receipt', (receipt) => {
        console.log("mint successfull")
    })
  }
  
  render(){
    return (
      <main>
        <h1 class="page-heading">Issue Token</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          
          console.log(new FormData(event.target))
    
          const unixTimestamp = Math.floor(new Date(this.birthdate.value).getTime() / 1000);

          console.log(this.gender.value)
          console.log(this.species.value)
          console.log(this.breed.value)
          console.log(unixTimestamp)
          console.log(this.diseases)
          console.log(this.furColor.value)

          this.mint(this.gender.value, this.species.value, this.breed.value, unixTimestamp, this.diseases, this.furColor.value)}}
          className='mx-10'>
          <input
            type='text'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            placeholder='e.g. Breed'
            ref={(input) => { this.breed = input }}
            required
          />
          <input
            type='text'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            placeholder='e.g. Species 0 to 8'
            ref={(input) => { this.species = input }}
            required
          />
          <input
            type='text'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            placeholder='e.g. Gender 1 or 0'
            ref={(input) => { this.gender = input }}
            required
          />
          <input
            type='date'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            ref={(input) => { this.birthdate = input }}
            required
          />
          
          
          <RadialMenu title={"lol"} name={"animal"} options={ ["o1", "a2", "d3"] } />;
          
          
          <select 
            multiple 
            onChange={this.handleSelectChange}
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white'>
            <option disabled value="">
              Select diseases
            </option>
            {Object.entries(AnimalMaps.ANIMAL_DISEASES).map(([key, value]) => {
            if (key !== "99") {
              return (
              <option key={key} value={key}>
                {value}
              </option>
            );}
            return null; // Exclude key "99"
            })}
          </select>
          <input
            type='text'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            placeholder='e.g. Fur color from 0 to 5'
            ref={(input) => { this.furColor = input }}
            required
          />
          <input
            type='submit'
            className='crypto-button-vanilla crypto-button-base'
            value='MINT'
          />
        </form>
      </main>
    )
  }

};
export default MintAnimal;

