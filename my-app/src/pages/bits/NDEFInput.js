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
                    var ndefContents = ""
                
                    ndefContents += `> Serial Number: ${serialNumber} \n`

                    for (const record of message.records) {
                        ndefContents += `Record type:  ${record.recordType}, `;
                        ndefContents += `MIME type:    ${record.mediaType}, `;
                        ndefContents += `Record id:    ${record.id}, `;
                        ndefContents += `Record data:    ${record.data} \n\n`;
                        
                        switch (record.recordType) {
                            case "text":
                                // TODO: Read text record with record data, lang, and encoding.
                                break;
                            case "url":
                                // TODO: Read URL record with record data.
                                break;
                            default:
                            // TODO: Handle other records with record data.
                        }
                    }
                    
                    setTagData(ndefContents)

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