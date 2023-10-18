import React, { useState, useEffect } from 'react';
import AnimalCard from './bits/AnimalCard';

import { useSelector, useDispatch } from 'react-redux';

import {
    readContract
} from '@wagmi/core'

import {
    useContractRead
} from 'wagmi'

const ShowAll = () => {
    const [allAnimals, setAllAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const contract_abi = useSelector((state) => state.contract.abi);
    const contract_address = useSelector((state) => state.contract.address);

    const contract_supply = useContractRead({
        abi: contract_abi,
        address: contract_address,
        functionName: 'totalSupply',
        watch: true,
    })
    
    const fetch_animals_from_contract = async () => {
        setLoading(true);
        
        let all_animals_at_start = allAnimals;
        
        for (let i = all_animals_at_start.length; i < Number(contract_supply.data); i++) {
            try{
                let single_read_animal = await readContract({
                    abi: contract_abi,
                    address: contract_address,
                    functionName: 'getAnimal',
                    args: [i]
                })
                
                //adding in loop to make it look swifter:
                all_animals_at_start.push(single_read_animal)
                setAllAnimals(all_animals_at_start);
            } catch(error) {
                console.warn("Error while fetchhing animal " + i + ": ", error );
            }
        }
        
        setLoading(false)
    }
    
    useEffect(() => {    
        fetch_animals_from_contract();
    }, []);

    

    
    
    return (
        <main>
            <h1 className="page-heading">Registered Animals</h1>
            
            <div className='flex flex-row p-2 mt-4'>
                <button class='crypto-button justify-self-start' onClick={fetch_animals_from_contract} >Update</button>
            </div>
            
            <ul className="grid grid-cols-1 auto-rows-max md:grid-cols-2 xl:grid-cols-3 gap-4">
                { allAnimals.length > 0 ? (
                    allAnimals.map((animal, index) => (
                        <AnimalCard key={index} animal={animal} />
                    )) 
                    
                    ) : (
                    
                    // non found
                    <li>
                        No pets found.
                    </li>
                )}
                
                { loading &&
                    <li>
                        loading...
                    </li>
                }
                
            </ul>
        </main>
    );
};

export default ShowAll;
