import RadialMenu from "../bits/RadialMenu";
import * as AnimalMaps from "../../constants";
import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {prepareWriteContract, writeContract} from "wagmi/actions";
import {useWaitForTransaction} from "wagmi";

import { setCountdown, setColor, setLink, setText } from '../../redux/slices/tooltipSlice';


const MintAnimal = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const [diseases, setDiseases] = useState([]);
    const [furColor, setFurColor] = useState('');
    const [species, setSpecies] = useState('');
    const [gender, setGender] = useState('');
    const [breed, setBreed] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [hash, setHash] = useState('')

    const contract_abi = useSelector((state) => state.contract.abi);
    const contract_address = useSelector((state) => state.contract.address);

    const resetValues = () => {
        setDiseases([]);
        setFurColor('')
        setSpecies('')
        setGender('')
        setBreed('')
        setBirthdate('')
    }

    const handleSelectChange = (event) => {
        setDiseases(Array.from(event.target.selectedOptions, option => parseInt(option.value)))
        console.log(diseases)
    };

    const mint = async (gender, species, breed, birthdate, diseases, furColor) => {
        const config = await prepareWriteContract({
            address: contract_address,
            abi: contract_abi,
            functionName: 'mint',
            args: [gender, species, breed, birthdate, diseases, furColor]
        })

        try {
            const transaction = await writeContract(config)
            setHash(transaction.hash)
            
            dispatch(setColor('green'));
            dispatch(setCountdown(5000));
            dispatch(setText('Animal minted'));
            dispatch(setLink(getUrlLink()));
            
            resetValues()
        } catch (error) {
            console.log(error.message)
            dispatch(setColor('red'));
            dispatch(setCountdown(5000));
            dispatch(setText(error.message));
            dispatch(setLink(''));
        }
    }

    const getUrlLink = () => {
        const url = `https://sepolia.etherscan.io/tx/${hash}`
        return <a href={url} target="_blank">{hash}</a>
    }

    return (
        <main className="
            mb-4
            p-4 rounded-lg
            
            w-full
            
            milky-glass
            border-2 border-solid border-neutral-200
            
        ">
            <h1 class="page-heading">Issue Token</h1>
            {!loading ? (
                <form onSubmit={(event) => {
                    setLoading(true)
                    
                    if (furColor == "" || species == "" || gender == "" || breed == "" || birthdate == "") {
                        dispatch(setColor('red'));
                        dispatch(setCountdown(3000));
                        dispatch(setText('Fill all input fields'));
                        dispatch(setLink(''));
                        setLoading(false);
                        return; 
                    }


                    console.log(new FormData(event.target))

                    const unixTimestamp = Math.floor(new Date(birthdate).getTime() / 1000);

                    console.log(`Gender ${gender}`)
                    console.log(`Species ${species}`)
                    console.log(`Breed ${breed}`)
                    console.log(`Timestamp ${unixTimestamp}`)
                    console.log(`Diseases ${diseases}`)
                    console.log(`Furcolor: ${furColor}`)

                    mint(gender, species, breed, unixTimestamp, diseases, furColor)
                        .finally(() => setLoading(false));
                }}
                className='mx-10'>

                    <h1 className="text-4xl font-bold text-center mb-4"></h1>
                    <h2 className='my-5 form-control'>Name</h2>
                    <input
                        type='text'
                        className='milky-glass my-5 form-control text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
                        placeholder='e.g. Tim'
                        onChange={(e) => setBreed(e.target.value)}
                        value={breed}
                        required
                    />
                    <h1 className='my-5 form-control'>Species</h1>
                    <select
                        className='milky-glass my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-white focus:text-neutral-800 focus:border-sky-300 block w-full p-2.5 border-2 border-white'
                        onChange={(event) => setSpecies(event.target.value)}
                        value={species}
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
                        className='milky-glass my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-white focus:text-neutral-800 focus:border-sky-300 block w-full p-2.5 border-2 border-white'
                        onChange={(event) => setGender(event.target.value)}
                        value={gender}
                        required>
                        <option value='' disabled>Select a gender</option>
                        {Object.entries(AnimalMaps.ANIMAL_GENDERS).map(([key, value]) => {
                            if (key != '99') {
                                return <option key={key} value={key} className='milky-glass '>{value}</option>;
                            }
                            return null;
                        })}
                    </select>
                    <h1 className='my-5 form-control'>Birthdate</h1>
                    <input
                        type='date'
                        className='milky-glass my-5 form-control bg-transparent text-white text-sm rounded-lg focus:border-sky-300 block w-full p-2.5 border-2 border-white placeholder-white placeholder-opacity-70'
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                    />

                    

                    <h1 className='my-5 form-control'>Diseases</h1>
                    <select
                        multiple
                        onChange={handleSelectChange}
                        className='milky-glass my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-white focus:text-neutral-800 focus:border-sky-300 block w-full p-2.5 border-2 border-white'>
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
                            return null; // Exclude key "99"
                        })}
                    </select>
                    <h1 className='my-5 form-control'>Color</h1>
                    <select
                        className='milky-glass my-5 form-control bg-transparent text-white text-sm rounded-lg focus:bg-white focus:text-neutral-800 focus:border-sky-300 block w-full p-2.5 border-2 border-white'
                        onChange={(event) => setFurColor(event.target.value)}
                        value={furColor}
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
                        className=' 
                            cursor-pointer
                            px-4 py-2
                            rounded-lg shadow-sm  
                            text-sm font-medium text-neutral-900
                            
                            bg-white hover:bg-neutral-200 transition-all
                        '
                        value='MINT'
                    />
                </form>
            ) : (
                <div className="flex h-screen items-center justify-center flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Loading...</h1>
                    <p className="text-lg text-center">Check your wallet for more details</p>
                </div>
            )}
        </main>
    );
};

export default MintAnimal;