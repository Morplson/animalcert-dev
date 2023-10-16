import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../redux/slices/counterSlice';

const Home = ({ web3, contract, match }) => {

    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    const [animalCount, setAnimalCount] = useState(null);
    const [Owner, setOwner] = useState(null);


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

    async function verifyOwnerId(ID) {
        var count = false
        try { count = await contract.methods.balanceOf(ID).call(); }
        catch { console.log("ID error"); return 0; }
        if (count !== false && count > 0) {
            return 1;
        }
        else {
            return 0;
        }
    }

    async function openOwner(ID) {
        if (await verifyOwnerId(ID) === 1) {
            console.log("GRR")
            //open link
            window.location.href = '/owner/' + ID;
        }
        else {
            //popup err msg
            window.alert("The certificate is not valid")
        }
    }

    return (


        <main>
            <h1 className="page-heading">Animal Certificate</h1>

            <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>

            <div className="mx-8 my-12 flex justify-center">
                <div class="flex flex-col w-full max-w-md">
                    <label class="text-sm mb-1">Find a certificate</label>
                    <div class="relative">
                    <div class="relative">
                        <input type="text" value={Owner} onChange={(e) => setOwner(e.target.value)} placeholder="0x..." class="bg-transparent text-white text-2xl w-full border-b border-white focus:border-gray-300 focus:outline-none"></input>
                        <button onClick={() => openOwner(Owner)} class="absolute right-0 top-0 mt-2 text-sm underline hover:no-underline">[Find...]</button>
                    </div>
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
