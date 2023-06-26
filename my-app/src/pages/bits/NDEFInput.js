import React, { useState, useEffect } from 'react';


const NDEFInput = ({ output }) => {
    const [tagData, setTagData] = useState("");

    const handleScan = async () => {
        console.log("User clicked scan button");

        try {
            //const ndef = new NDEFReader() ;
            await ndef.scan();
            console.log("> Scan started");

            ndef.addEventListener("readingerror", () => {
                console.log("Argh! Cannot read data from the NFC tag. Try another one?");
            });

            ndef.addEventListener("reading", ({ message, serialNumber }) => {
                setTagData(`> Serial Number: ${serialNumber}`);
            });
        } catch (error) {
            console.log("Argh! " + error);
        }
    };

    return (
    <div>
        <button onClick={handleScan}>Read DATA</button>
        <p>{tagData}</p>
        </div>
    )

}

export default NDEFInput;