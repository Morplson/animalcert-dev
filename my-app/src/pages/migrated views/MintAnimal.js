import React, { useState, useEffect } from 'react';
import * as AnimalMaps from '../../constants'
import { Web3Context, Web3Data } from '../../deprecated/Web3Context';


import { useSelector, useDispatch } from 'react-redux';

import {
  writeContract
} from '@wagmi/core'


const MintAnimal = () => {
  const [diseases, setDiseases] = useState([]);
  const [furColor, setFurColor] = useState(null);
  const [species, setSpecies] = useState(null);
  const [gender, setGender] = useState(null);

  const handleSelectChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => parseInt(option.value));
    setDiseases(selectedValues);
    console.log(diseases);
  };

  const mint = (gender, species, breed, birthdate, diseases, furColor) => {
    let contract = context.web3data.contract;
    let account = context.web3data.address;
    contract.methods.mint(gender, species, breed, birthdate, diseases, furColor).send({ from: account })
      .once('receipt', (receipt) => {
        console.log("mint successful");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(new FormData(event.target));

    const unixTimestamp = Math.floor(new Date(birthdate.value).getTime() / 1000);

    console.log(gender);
    console.log(species);
    console.log(breed.value);
    console.log(unixTimestamp);
    console.log(diseases);
    console.log(furColor);

    mint(gender, species, breed.value, unixTimestamp, diseases, furColor);
  };

  return (
    <main>
      <h1 className="page-heading">Issue Token</h1>
      <form onSubmit={handleSubmit} className="mx-10">
        <h2 className="my-5 form-control">Name</h2>
        <input
          type="text"
          className="milky-glass my-5 form-control text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70"
          placeholder="e.g. Tim"
          ref={(input) => { breed = input; }}
          required
        />
        <h1 className="my-5 form-control">Species</h1>
        <select
          className="my-5 form-control bg-transparent text-white text-sm rounded-lg focus-bg-[#F3AE4B] focus-border-blue-500 block w-full p-2.5 border-2 border-white"
          onChange={(event) => { setSpecies(event.target.value); }}
          defaultValue=""
          required
        >
          <option value="" disabled>Select an animal species</option>
          {Object.entries(AnimalMaps.ANIMAL_SPECIES).map(([key, value]) => {
            if (key !== '99') {
              return <option key={key} value={key}>{value}</option>;
            }
            return null;
          })}
        </select>
        <h1 className="my-5 form-control">Gender</h1>
        <select
          className="my-5 form-control bg-transparent text-white text-sm rounded-lg focus-bg-[#F3AE4B] focus-border-blue-500 block w-full p-2.5 border-2 border-white"
          onChange={(event) => { setGender(event.target.value); }}
          defaultValue=""
          required
        >
          <option value="" disabled>Select a gender</option>
          {Object.entries(AnimalMaps.ANIMAL_GENDERS).map(([key, value]) => {
            if (key !== '99') {
              return <option key={key} value={key} className="milky-glass">{value}</option>;
            }
            return null;
          })}
        </select>
        <h1 className="my-5 form-control">Birthdate</h1>
        <input
          type="date"
          className="my-5 form-control bg-transparent text-white text-sm rounded-lg focus-border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70"
          ref={(input) => { birthdate = input; }}
          required
        />

        <h1 className="my-5 form-control">Diseases</h1>
        <select
          multiple
          onChange={handleSelectChange}
          className="my-5 form-control bg-transparent text-white text-sm rounded-lg focus-border-blue-500 block w-full p-2.5 border-2 border-white"
        >
          <option disabled value="">
            Select diseases
          </option>
          {Object.entries(AnimalMaps.ANIMAL_DISEASES).map(([key, value]) => {
            if (key !== "99") {
              return (
                <option key={key} value={key}>
                  {value}
                </option>
              );
            }
            return null;
          })}
        </select>
        <h1 className="my-5 form-control">Color</h1>
        <select
          className="my-5 form-control bg-transparent text-white text-sm rounded-lg focus-bg-[#F3AE4B] focus-border-blue-500 block w-full p-2.5 border-2 border-white"
          onChange={(event) => {
            console.log(event.target.value);
            setFurColor(event.target.value);
            console.log(furColor);
          }}
          defaultValue=""
          required
        >
          <option value="" disabled>Select a fur color</option>
          {Object.entries(AnimalMaps.ANIMAL_COLORS).map(([key, value]) => {
            if (key !== '99') {
              return <option key={key} value={key}>{value}</option>;
            }
            return null;
          })}
        </select>
        <input
          type="submit"
          className="crypto-button-vanilla crypto-button-base"
          value="MINT"
        />
      </form>
    </main>
  );
};

export default MintAnimal;

