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
                    const decoder = new TextDecoder();
                    var ndefContents = ""
                
                    ndefContents += `> Serial Number: ${serialNumber} \n`

                    for (const record of message.records) {
                        ndefContents += `Record type:  ${record.recordType}, `;
                        ndefContents += `MIME type:    ${record.mediaType}, `;
                        ndefContents += `Record id:    ${record.id}, `;
                        ndefContents += `Record data:    ${record.data}, `;
                        
                        switch (record.mediaType) {
                            case "application/json":
                                // TODO: Read JSON record with record data.
                                let text = decoder.decode(record.data);
                                let json = JSON.parse(text);
                                ndefContents += `Record text:  ${text} \n`;
                                ndefContents += `Record json:  ${json} \n\n`;
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