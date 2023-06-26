import React, { useState, useEffect } from 'react';


const NDEFInput = ({ output }) => {
    const [tagData, setTagData] = useState("");
    const [isCompatible, setIsCompatible] = useState('NDEFReader' in window);

    const handleScan = async () => {
        console.log("User clicked scan button");
        if (isCompatible) {
            try {
                const ndef =  new window.NDEFReader();
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
        }
        
    };

    return (
        <React.Fragment>
            {isCompatible ?
                <React.Fragment>
                    <button className='crypto-button' onClick={handleScan}>Read DATA</button>
                    <p>{tagData}</p>
                </React.Fragment>
                :
                <div> Browser is not compatible... </div>
            }
        </React.Fragment>
    )

}

export default NDEFInput;