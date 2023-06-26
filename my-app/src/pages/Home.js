import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import NDEFInput from "./bits/NDEFInput";


const Home = ({ web3, contract, match }) => {

    const [animalCount, setAnimalCount] = useState(null);


    async function updateAnimalCount() {
        const count = await contract.methods.totalSupply().call();

        setAnimalCount(count);
        console.log("updated Count");
    }

    useEffect(() => {
        updateAnimalCount();

        const intervalId = setInterval(() => {
            updateAnimalCount();
        }, 30000);
        return () => clearInterval(intervalId);
    }, [contract]);



    return (


        <main>
            
            <NDEFInput></NDEFInput>
            
            <h1 className="page-heading">Animal Certificate</h1>

            <div className="mx-8 my-12 flex justify-center">
                <div class="flex flex-col w-full max-w-md">
                    <label class="text-sm mb-1">Find a certificate</label>
                    <div class="relative">
                        <input type="text" placeholder="0x..." class="bg-transparent text-white text-2xl w-full border-b border-white focus:border-gray-300 focus:outline-none"></input>
                        <button class="absolute right-0 top-0 mt-2 text-sm underline hover:no-underline">[Find...]</button>
                    </div>
                    <Link to="/animals" class="text-lg underline mt-4">[Find all...]</Link>
                </div>
            </div>

            <div class="mx-8 mt-12">
                <h2 class="text-2xl font-medium text-white mb-4"><span class="mr-2">&#9658;</span>Mission:</h2>
                <p class="text-lg">
                    A project to Verify your Pet's heritage from certified animal breeders. <br />

                    There are currently {animalCount} pets Certified through our service. <br />

                    Get you certificate <Link >TODAY</Link> <br />
                </p>
            </div>

        </main>



    );
};

export default Home;
