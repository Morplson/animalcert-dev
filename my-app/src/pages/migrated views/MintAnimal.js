import React, { Component } from 'react';
import * as AnimalMaps from '../../constants'
import { Web3Context, Web3Data } from '../../Web3Context';

class MintAnimal extends Component{
  static contextType = Web3Context;

  constructor(props) {
    super(props)
    this.diseases = []
    this.furColor = null
    this.species = null
    this.gender = null
  }

  handleSelectChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => parseInt(option.value))
    this.diseases = selectedValues
    console.log(this.diseases)
  };
  
  mint = (gender, species, breed, birthdate, diseases, furColor) => {
    let contract = this.context.web3data.contract
    let account = this.context.web3data.address
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

          console.log(this.gender)
          console.log(this.species)
          console.log(this.breed.value)
          console.log(unixTimestamp)
          console.log(this.diseases)
          console.log(this.furColor)

          this.mint(this.gender, this.species, this.breed.value, unixTimestamp, this.diseases, this.furColor)}}
          className='mx-10'>
          <h2 className='my-5 form-control'>Name</h2>  
          <input
            type='text'
            className='milky-glass my-5 form-control text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            placeholder='e.g. Tim'
            ref={(input) => { this.breed = input }}
            required
          />
          <h1 className='my-5 form-control'>Species</h1>  
          <select
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-[#F3AE4B] focus:border-blue-500 block w-full p-2.5 border-2 border-white'
            onChange={(event) => { this.species = event.target.value}}
            defaultValue=''
            required>
            <option value='' disabled>Select an animal species</option>
              {Object.entries(AnimalMaps.ANIMAL_SPECIES).map(([key, value]) => {
                if (key !== '99') {
                  return <option key={key} value={key}>{value}</option>;
                }
                return null;
              })}
          </select>
          <h1 className='my-5 form-control'>Gender</h1>  
          <select
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-[#F3AE4B] focus:border-blue-500 block w-full p-2.5 border-2 border-white'
            onChange={(event) => { this.gender = event.target.value}}
            defaultValue=''
            required>
            <option value='' disabled>Select a gender</option>
              {Object.entries(AnimalMaps.ANIMAL_GENDERS).map(([key, value]) => {
                if (key !== '99') {
                  return <option key={key} value={key} className='milky-glass '>{value}</option>;
                }
                return null;
              })}
          </select>
          <h1 className='my-5 form-control'>Birthdate</h1>  
          <input
            type='date'
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
            ref={(input) => { this.birthdate = input }}
            required
          />
                    
          <h1 className='my-5 form-control'>Diseases</h1>
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
          <h1 className='my-5 form-control'>Color</h1>  
          <select
            className='my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-[#F3AE4B] focus:border-blue-500 block w-full p-2.5 border-2 border-white'
            onChange={(event) => { 
              console.log(event.target.value)
              this.furColor = event.target.value
              console.log(this.furColor)
            }}
            defaultValue=''
            required>
            <option value='' disabled>Select a fur color</option>
              {Object.entries(AnimalMaps.ANIMAL_COLORS).map(([key, value]) => {
                if (key !== '99') {
                  return <option key={key} value={key}>{value}</option>;
                }
                return null;
              })}
          </select>
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

