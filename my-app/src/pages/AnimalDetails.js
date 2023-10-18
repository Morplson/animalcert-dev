import { Link, useParams } from 'react-router-dom';

import EthAddress from './bits/EthAddress';
import * as AnimalMaps from '../constants';

import { useSelector, useDispatch } from 'react-redux';

import {
	useContractRead
} from 'wagmi'

const AnimalDetails = () => {
	const { id } = useParams();

	const contract_abi = useSelector((state) => state.contract.abi);
	const contract_address = useSelector((state) => state.contract.address);

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

	return (
		<main>
			{(single_read_animal.isLoading || single_ownerOf_animal.isLoading) ? (
				<>
					loading...
				</>
			) : (
				<>
					{!(single_read_animal.isError || single_ownerOf_animal.isError) ? (
						<div class="flex flex-col items-center">

							<img
								src={AnimalMaps.ANIMAL_SPECIES_IMAGES[animal.species ?? 99n]}
								class="rounded-full border-white border-4 w-32 h-32 mx-auto mt-6 blue-glow-element"
							/>

							<h2 class="text-3xl font-bold mt-4">Animal Name: {animal.breed} </h2>
							<div class="text-xl mt-1">Owner: <Link to={"/owner/" + owner} className="underline"> <EthAddress>{owner}</EthAddress> </Link> </div>


							<div class="text-2xl">{animal.dateOfDeath > 0 ? <span className="text-7xl">❌</span> : ""}</div>
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