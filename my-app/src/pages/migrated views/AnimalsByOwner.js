import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import AnimalCard from '../bits/AnimalCard';
import EthAddress from '../bits/EthAddress';

const AnimalsByOwner = ({ web3, contract }) => {
  const [allAnimals, setAllAnimals] = useState(null);

  let { id } = useParams();

  async function updateAnimals(address) {
    const count = await contract.methods.balanceOf(address).call();
    // Load Animals
    const fetched_animals = [];
    for (var i = 1; i <= count; i++) {
      const animalId = await contract.methods.tokenOfOwnerByIndex(address, i - 1).call();
      const animal = await contract.methods.getAnimal(animalId).call();
      fetched_animals.push(animal)
      console.log("fetched animal with id " + animalId);
      console.log(animal);
    }

    console.log(fetched_animals);
    setAllAnimals(fetched_animals);
    //console.log(allAnimals);
    console.log("updated Animals");
  }


  useEffect(() => {
    updateAnimals(id);
  }, [id]);

  return (
    <main>
      <h1  class="page-heading"><EthAddress>{id}</EthAddress>'s Pet{allAnimals != null && (allAnimals.length > 1 && "s")}:</h1>

      <button class='crypto-button-base crypto-button-vanilla' onClick={() => updateAnimals(id)}>Update</button>

      <ul class="mt-4 flex flex-col justify-center  items-center">
        {allAnimals != null ? (
          allAnimals.length > 0 ?
            allAnimals.map((animal, index) => (
              <AnimalCard key={index} animal={animal} />
            ))
            : // non found
            <div>
              No pets found.
            </div>
        )
          : // loaing animation
          <div>
            Loading...
          </div>
        }
      </ul>
    </main>
  );
};

export default AnimalsByOwner;



/* <main role="main" className="col-lg-12 d-flex text-center">

              <div className="content mr-auto ml-auto">
                <h1>Show Animals by Owner-Address</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  this.getAnimalsOfOwner(this.id.value);
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='id'
                    ref={(input) => { this.id = input }}
                  />

                  <ul id="animalDetail"></ul>
                  {
                  this.state.animalsOfOwner.map((animal, key) => {

                  const dog = require('../dog.webp');
                  const cat = require('../cat.webp');
                  let icon = animal.species === 0 ? cat : dog;

                  return(
                     <div key={key} className="col-md-3 mb-3" style={{backgroundColor: animal.gender===0 ? "pink" : "lightblue"}}>
                       <div>ID {animal.id.toString()}</div>
                       <div>breed {animal.breed}</div>
                       <div>gender {animal.gender===0 ? "Female" : "Male"}</div>
                       <div>species {animal.species === 0 ? 'cat' : 'dog'}</div>                  
                       <div>Pregnant {animal.pregnant.toString()}</div>
                       <div>Mother {animal.mother.toNumber()}</div>
                       <div>Father {animal.father.toNumber()}</div>
                       <img src={icon } width = "50" />
                     </div>
                   )
                 })
                  }
                </form>
              </div>
            </main>
            */