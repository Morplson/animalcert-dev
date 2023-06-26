import React, { useState, useEffect } from 'react';
import AnimalCard from '../bits/AnimalCard';
import { Link } from "react-router-dom";

const ShowAll = ({ web3, contract, match }) => {
    const [allAnimals, setAllAnimals] = useState(null);

    async function updateAllAnimals(){    
        const count = await contract.methods.totalSupply().call();
        // Load Animals
        const fetched_animals = [];
        for (var i = 1; i <= count; i++) {
            const animal = await contract.methods.getAnimal(i - 1).call();
            
            //animal.owner =  contract.methods.ownerOf(animal.id).call();
            
            fetched_animals.push(animal)
            console.log(animal);
        }

        console.log(fetched_animals);
        setAllAnimals(fetched_animals);
        //console.log(allAnimals);
        console.log("updated Animals");
    }
    
    const handleUpdateAction = (isMajor)=>{
        
        if (handleUpdateAction.timeoutId) {
            clearTimeout(handleUpdateAction.timeoutId);
        }

        handleUpdateAction.timeoutId = setTimeout(() => {
            if(isMajor) updateAllAnimals();
            
            handleUpdateAction.timeoutId = null;
        }, 11);
    
    
    }

    useEffect(() => {
        updateAllAnimals();
        console.log(allAnimals);
    }, [contract]);
    
    return (
        <main>
            <h1 className="page-heading">Registered Animals</h1>
            
            <div className='flex flex-row p-2 mt-4'>
                <button class='crypto-button justify-self-start' onClick={() => handleUpdateAction(true)}>Update</button>
            </div>
            
            <ul className="grid grid-cols-1 auto-rows-max md:grid-cols-2 xl:grid-cols-3 gap-4">
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

export default ShowAll;
