import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import EthAddress from '../bits/EthAddress';
import * as AnimalMaps from '../../constants'

const AnimalDetails = ({ web3, contract }) => {
	const [animal, setAnimal] = useState(null);
	const [owner, setOwner] = useState(null);

	let { id } = useParams();

	async function getAnimalById(id) {
		const animal = await contract.methods.getAnimal(id).call();
		setAnimal(animal);
		const owner = await getOwnerOf(id);
		setOwner(owner)
	}

	async function getOwnerOf(id) {
		return contract.methods.ownerOf(id).call()
	}

	useEffect(() => {
		getAnimalById(id);
	}, [id]);


	return (
		<main>
			{animal !== null && owner !== null ? // animal loaded
				<div class="flex flex-col items-center">

					<img
						src={AnimalMaps.ANIMAL_SPECIES_IMAGES[animal.species ?? 99]}
						class="rounded-full border-white border-4 w-32 h-32 mx-auto mt-6 blue-glow-element"
					/>

					<h2 class="text-3xl font-bold mt-4">Animal Name: {animal.breed} </h2>
					<div class="text-xl mt-1">Owner: <Link to={"/owner/" + owner} className="underline"> <EthAddress>{owner}</EthAddress> </Link> </div>


					<div class="text-2xl">{animal.dateOfDeath > 0 ? <span className="text-7xl">❌</span> : ""}</div>
					<div class="text-sm mt-2">
						<span>Species: {AnimalMaps.ANIMAL_SPECIES[animal.species ?? 99]}</span>
						<span class="mx-2">|</span>
						<span>Gender: {AnimalMaps.ANIMAL_GENDERS[animal.gender ?? 99]}</span>
						<span class="mx-2">|</span>
						<span>Birthday: {new Date(animal.dateOfBirth * 1000).toLocaleDateString('de-AT')}</span>
					</div>
					<div class="text-sm mt-1">
						<span>Fur Color: {AnimalMaps.ANIMAL_COLORS[animal.furColor ?? 99]}</span>
						<span class="mx-2">|</span>
						<span>Diseases: {animal.diseases.length > 0
							? animal.diseases.map((disease) => AnimalMaps.ANIMAL_DISEASES[disease]).join(", ")
							: "no known diseases"}</span>
					</div>

					<h3 class="text-3xl font-bold mt-8">Parents:</h3>
					<Link to={"/ancestry/" + animal.id} className="underline">Ancestral tree</Link>
					<div>Mother {animal.mother}</div>
					<div>Father {animal.father}</div>

				</div>
				: // loading animation
				<div className="text-6xl text-center">
					Loading...
				</div>
			}

		</main>
	);
};
export default AnimalDetails;