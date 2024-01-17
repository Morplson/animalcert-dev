import {Link, useParams} from 'react-router-dom';

import EthAddress from './bits/EthAddress';
import DeclareDeathButton from './bits/DeclareDeathButton';
import ConfirmPregnancyButton from './bits/ConfirmPregnancyButton';
import BirthButton from './bits/BirthButton';


import * as AnimalMaps from '../constants';

import {useSelector, useDispatch} from 'react-redux';

import {
    useAccount,
    useContractRead
} from 'wagmi'
import {useEffect, useRef, useState, createRef} from "react";
import {prepareWriteContract, writeContract} from "wagmi/actions";
import {getTimeInUnix} from "../helper";
import {ANIMAL_DISEASES} from "../constants";

const AnimalDetails = () => {
    const {id} = useParams();

    const contract_abi = useSelector((state) => state.contract.abi);
    const contract_address = useSelector((state) => state.contract.address);
    const account = useAccount()

    const single_read_animal = useContractRead({
        abi: contract_abi,
        address: contract_address,
        functionName: 'getAnimal',
        args: [id],
        watch: true,
    })

    const single_ownerOf_animal = useContractRead({
        abi: contract_abi,
        address: contract_address,
        functionName: 'ownerOf',
        args: [id],
        watch: true,
    })

    const animal = single_read_animal.data;
    const owner = single_ownerOf_animal.data;



    const abort_pregnancy = async (id) => {
        const config = await prepareWriteContract({
            address: contract_address,
            abi: contract_abi,
            functionName: 'abortPregnancy',
            args: [id]
        })

        try {
            const transaction= await writeContract(config)
            return true;
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }

    const add_Disease = async (id, disease) => {
        const config = await prepareWriteContract({
            address: contract_address,
            abi: contract_abi,
            functionName: 'addDisease',
            args: [id, disease]
        })

        try {
            const transaction = await writeContract(config)
            return true;
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }

    const AbortPregnancyButton = () => {
        const [isModalOpen, setModalOpen] = useState(false);
        const [isErrorOpen, setIsErrorOpen] = useState(false);
        const cancelButtonRef = useRef(null);

        useEffect(() => {
            if (isModalOpen) {
                cancelButtonRef.current.focus();
            }
        }, [isModalOpen]);

        const handleAbortClick = () => setModalOpen(true);

        const handleCancel = () => {
            setModalOpen(false);
        };

        const handleConfirm = () => {
            // Set the state to close the modal
            setModalOpen(false);
            abort_pregnancy(animal.id)
                .then(r => {
                    console.log(r)
                    setIsErrorOpen(r !== true)
                })
        };

        return (
            <div>
                <button
                    className="bg-red-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAbortClick}
                >
                    Abort Pregnancy
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded">
                            <p className="text-gray-800 mb-4">
                                Are you sure, that you want to abort this pregnancy? This action cannot be reverted.
                            </p>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-4 rounded"
                                onClick={handleConfirm}
                            >
                                Confirm pregnancy abortion
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 ml-2 mt-4 rounded"
                                autoFocus
                                ref={cancelButtonRef}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {isErrorOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-red-400 p-6 rounded">
                            <p className="text-white mb-4">
                                An error occurred!
                            </p>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 ml-2 mt-4 rounded mx-auto"
                                autoFocus
                                onClick={() => setIsErrorOpen(false)}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>)
    }

const AddDiseaseButton = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDisease, setSelectedDisease] = useState(0)
    const cancelButtonRef = useRef(null);
    useEffect(() => {
        if (isModalOpen) {
            cancelButtonRef.current.focus();
        }
    }, [isModalOpen]);
    const handleAddDisease = () => setModalOpen(true);
    const handleCancel = () => {
        setModalOpen(false);
    };
    const handleConfirm = () => {
        // Set the state to close the modal
        setModalOpen(false);
        add_Disease(animal.id, selectedDisease)
            .then(r => {
                console.log(r)
            })
    };
    const SingleChoiceListOfPossibleDiseases = () => {
        const [possibleDiseases, setPossibleDiseases] = useState([]);
        const handleDiseaseChange = (event) => {
            setSelectedDisease(event.target.value);
        };
        useEffect(() => {
            const excludedKeys = animal.diseases.concat(99).map(Number);
            console.log(excludedKeys)
            const filteredDiseases = Object.fromEntries(
                Object.entries(ANIMAL_DISEASES).filter(([key]) => !excludedKeys.includes(Number(key)))
            );
            setPossibleDiseases(filteredDiseases);
        }, [animal.diseases]); // Add animal.diseases as a dependency
        return (
            <select
                className="border-2 border-gray-300 bg-[#6b7280] h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                onChange={handleDiseaseChange}
                value={selectedDisease}
            >
                {Object.entries(possibleDiseases).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
        );
    };
    return(
        <div>
            <button
                className="bg-[#9a3412] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddDisease}
            >
                Add Disease
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded">
                        <p className="text-gray-800 mb-4">
                            Add disease
                        </p>
                        <SingleChoiceListOfPossibleDiseases />
                        <button
                            className="bg-[#4d7c0f] hover:bg-red-600 text-white font-bold py-2 px-4 mt-4 ml-4 rounded"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 ml-2 mt-4 rounded"
                            autoFocus
                            ref={cancelButtonRef}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


    return (
        <main className="
            p-4 rounded-lg
            w-full
            
            milky-glass
            border-2 border-solid border-neutral-200
            
        ">
            {(single_read_animal.isLoading || single_ownerOf_animal.isLoading) ? (
                <>
                    loading...
                </>
            ) : (
                <>
                    {!(single_read_animal.isError || single_ownerOf_animal.isError) ? (
                        <div className="relative">
                            <div class="flex flex-col items-center">
                                <img
                                    src={AnimalMaps.ANIMAL_SPECIES_IMAGES[animal.species ?? 99n]}
                                    class="rounded-full border-white border-4 w-32 h-32 mx-auto mt-6 blue-glow-element"
                                />

                                <h2 class="text-3xl font-bold mt-4">Animal Name: {animal.breed} </h2>
                                <div class="text-xl mt-1">Owner: <Link to={"/owner/" + owner} className="underline">
                                    <EthAddress>{owner}</EthAddress> </Link></div>


                                <div class="text-2xl">{animal.dateOfDeath > 0 ?
                                    <span className="text-7xl">❌</span> : ""}</div>
                                <div class="text-sm mt-2">
                                    <span>Species: {AnimalMaps.ANIMAL_SPECIES[animal.species ?? 99n]}</span>
                                    <span class="mx-2">|</span>
                                    <span>Gender: {AnimalMaps.ANIMAL_GENDERS[animal.gender ?? 99n]}</span>
                                    <span class="mx-2">|</span>
                                    <span>Birthday: {new Date(Number(animal.dateOfBirth * 1000n)).toLocaleDateString('de-AT')}</span>
                                </div>
                                <div class="text-sm mt-1">
                                    <span>Fur Color: {AnimalMaps.ANIMAL_COLORS[animal.furColor ?? 99n]}</span>
                                    <span class="mx-2">|</span>
                                    <span>Diseases: {animal.diseases.length > 0n
                                        ? animal.diseases.map((disease) => AnimalMaps.ANIMAL_DISEASES[Number(disease)]).join(", ")
                                        : "no known diseases"}</span>
                                </div>

                                <h3 class="text-3xl font-bold mt-8">Parents:</h3>
                                <Link to={"/ancestry/" + Number(animal.id)} className="underline">Ancestral tree</Link>
                                <div>Mother {animal.mother}</div>
                                <div>Father {animal.father}</div>
                            </div>
                            {animal.dateOfDeath <= 0 && animal.diseases.length < Object.keys(AnimalMaps.ANIMAL_DISEASES).length && account.address && account.address === owner && (
                                <div className="fixed bottom-0 left-0 mb-4 ml-4">
                                    <AddDiseaseButton/>
                                </div>
                            )}
                            
                            <div className="fixed bottom-0 right-0 mb-4 flex flex-col gap-1 items-end">
                                {animal.pregnant === false && animal.dateOfDeath <= 0 && animal.gender === 0 && account.address && account.address === owner && (
                                    <div className=" me-4">
                                        <ConfirmPregnancyButton
                                            animal={animal}
                                        />
                                    </div>
                                )}
                                {animal.pregnant === true && account.address && account.address === owner && (
                                    <div className="mr-4">
                                        <BirthButton
                                            animal={animal}
                                        />
                                    </div>
                                )}
                                {animal.pregnant === true && account.address && account.address === owner && (
                                    <div className="mr-4">
                                        <AbortPregnancyButton/>
                                    </div>
                                )}
                                {animal.dateOfDeath <= 0 && account.address && account.address === owner && (
                                    <div className="mr-4">
                                        <DeclareDeathButton/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            An error occured while loading Passport number <b>"{id}"</b>:

                            Status:
                            animal: <i>{single_read_animal.status}</i>; ownerOf: <i>{single_ownerOf_animal.status}</i>

                            {single_read_animal.isError &&
                                <code> {single_read_animal.error.toString()} </code>
                            }
                            {single_ownerOf_animal.isError &&
                                <code> {single_ownerOf_animal.error.toString()} </code>
                            }

                        </>
                    )}
                </>
            )}

        </main>
    );

};

export default AnimalDetails;