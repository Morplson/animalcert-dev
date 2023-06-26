import React, { useState, useEffect } from 'react';


const NDEFInput = ({ output }) => {
    const [tagData, setTagData] = useState(" click button");
    const [isCompatible, setIsCompatible] = useState('NDEFReader' in window);

    const handleScan = async () => {
        alert("User clicked scan button");
        if (isCompatible) {
            try {
                const ndef =  new window.NDEFReader();
                await ndef.scan();
                alert("> Scan started");
    
                ndef.addEventListener("readingerror", () => {
                    setTagData("Argh! Cannot read data from the NFC tag. Try another one?");
                });
    
                ndef.addEventListener("reading", ({ message, serialNumber }) => {
                    alert(message);
                    setTagData(`> Serial Number: ${serialNumber}`);
                });
            } catch (error) {
                alert("Argh! " + error);
            }
        }
        
    };

    return (
        <React.Fragment>
            {true ?
                <React.Fragment>
                    <button className='crypto-button text-4xl' onClick={handleScan}>Read DATA</button>
                    <p>{tagData}</p>
                </React.Fragment>
                :
                <div> Browser is not compatible... </div>
            }
        </React.Fragment>
    )

}

export default NDEFInput;