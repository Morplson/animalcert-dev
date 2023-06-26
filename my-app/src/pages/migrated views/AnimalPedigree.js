//import './Pedigree.css';

import React, { useRef, useEffect, useState } from 'react';
import Component from '../bits/PedigreeCard';
import Connector from '../bits/PedigreeSpline';
import Dots from '../bits/PedigreeDots'

import { Link, useParams } from 'react-router-dom';


const AnimalPedigree = ({ web3, contract }) => {
  /**const data = [
      { initialPos: { x: 0, y: 0 }, id: 1, animal: 'Dad', connectedTo: [5, 6] },
      { initialPos: { x: 0, y: 0 }, id: 2, animal: 'Mom', connectedTo: [11, 12] },
      { initialPos: { x: 0, y: 0 }, id: 3, animal: 'Child 1', connectedTo: [1, 2] },
      { initialPos: { x: 0, y: 0 }, id: 4, animal: 'Child 2', connectedTo: [1] },
      { initialPos: { x: 0, y: 0 }, id: 5, animal: 'Grandparent 1', connectedTo: [] },
      { initialPos: { x: 0, y: 0 }, id: 6, animal: 'Grandparent 2', connectedTo: [] },
      { initialPos: { x: 0, y: 0 }, id: 7, animal: 'Uncle', connectedTo: [5, 6] },
      { initialPos: { x: 0, y: 0 }, id: 8, animal: 'Aunt', connectedTo: [13, 14] },
      { initialPos: { x: 0, y: 0 }, id: 9, animal: 'Cousin 1', connectedTo: [7, 8] },
      { initialPos: { x: 0, y: 0 }, id: 10, animal: 'Cousin 2', connectedTo: [7] },
      { initialPos: { x: 0, y: 0 }, id: 11, animal: 'Grandparent 3', connectedTo: [] },
      { initialPos: { x: 0, y: 0 }, id: 12, animal: 'Grandparent 4', connectedTo: [] },
      { initialPos: { x: 0, y: 0 }, id: 13, animal: 'Grandparent 5', connectedTo: [] },
      { initialPos: { x: 0, y: 0 }, id: 14, animal: 'Grandparent 6', connectedTo: [] },
    ];*/

  const fetchSingle = async (id) => {
    let single = await contract.methods.getAnimal(id).call();
    let owner = await contract.methods.ownerOf(id).call();

    let animal = Object.assign({}, single);
    animal.owner = owner

    return animal
  }

  const toDataItem = (animal) => {
    const dataOutPut = { initialPos: { x: 0, y: 0 }, id: 0, animal: null, connectedTo: [] }

    if (animal) dataOutPut.animal = animal;
    if (animal.id) dataOutPut.id = animal.id;
    if (animal.father !== animal.id) dataOutPut.connectedTo.push(animal.father);
    if (animal.mother !== animal.id) dataOutPut.connectedTo.push(animal.mother);

    return dataOutPut
  }

  const fetchAnimals = async (id) => {
    var doneList = [id]
    var dataList = []

    let master = await fetchSingle(id);

    dataList.push(toDataItem(master))


    let lookdepth = 2;
    let gNodes = []

    if(master.father !== master.id) gNodes.push(master.father);
    if(master.mother !== master.id) gNodes.push(master.mother);

    for (let index = 0; index < lookdepth; index++) {
      for (let jndex = 0; jndex < gNodes.length; jndex++) {
        const gid = gNodes.splice(jndex, 1)[0];
        
        if(!doneList.includes(gid)) {
          doneList.push(gid)

          let geriatric = await fetchSingle(gid);
  
          dataList.push(toDataItem(geriatric))
  
          if(geriatric.father !== geriatric.id) gNodes.push(geriatric.father);
          if(geriatric.mother !== geriatric.id) gNodes.push(geriatric.mother);
        }
      }
    }
    
    return dataList
  }

  let { id } = useParams();


  const [data, setData] = useState(null);

  
  
  const updateData = async (id) => {
    let animals = await fetchAnimals(id);
    animals = calculateInitialPositions(animals);
    
    console.log(animals)
    
    setData(animals)
  }





  const splineRefs = React.useRef([]);

  const handleDragOver = (event) => {
    event.dataTransfer.dropEffect = "move";
    event.preventDefault();
  };



  function calculateInitialPositions(data) {
    console.log(data)


    const layers = [];
    const offsetX = 225;
    const offsetY = 200;
    const globalTopOffset = 25;

    // Step 1: Cluster array into layers by connected nodes
    const grandparents = data.filter(node => node.connectedTo.length === 0);
    layers.push(grandparents);

    const parentsAndAunts = data.filter(node => node.connectedTo.some(id => grandparents.find(g => g.id === id)));
    layers.push(parentsAndAunts);

    const childrenAndCousins = data.filter(node => node.connectedTo.some(id => parentsAndAunts.find(p => p.id === id)));
    layers.push(childrenAndCousins);

    // Step 2: Calculate x and y coordinates for each node

    // Calculate the total width required to distribute the layers on the x-axis
    let totalWidth = 0;
    layers.forEach(layer => {
      totalWidth += Math.ceil(layer.length * offsetX);
    });

    // Calculate the center coordinates of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Iterate over each layer and distribute the nodes on the x and y axes
    layers.forEach((layer, layerIndex) => {
      let yPos = globalTopOffset + (centerY - (offsetY * layers.length) / 2) + ((layerIndex) * offsetY); // Calculate y position for the layer

      // Distribute nodes within the layer
      layer.forEach((node, nodeIndex) => {
        let xPos = (centerX - (offsetX * layer.length) / 2) + ((nodeIndex) * offsetX); // Calculate initial x position for the layer

        node.initialPos.x = xPos;
        node.initialPos.y = yPos;
      });
    });

    return data;
  }




  useEffect(() => {
    document.addEventListener("dragover", handleDragOver);
    
    updateData(id)

    console.log(data)

    //calculateInitialPositions();
  }, [contract, id]);


  return (
    <div>
      {data != null ? (
        data.length > 0 ?
          <React.Fragment>
            <div className="w-screen">
              {data.map((item) => {
                return (
                  <Component
                    initialPos={item.initialPos}
                    key={item.id}
                    index={item.id}
                    id={"pedigree-card-" + item.id}
                    ref={splineRefs}
                    animal={item.animal}
                    className="absolute"
                  />
                );
              }
              )}
            </div>
            {data.map((item) => (
              item.connectedTo.map((connectedId) => {
                if (connectedId != -1) {
                  return (
                    <Connector
                      key={`${item.id}-${connectedId}`}
                      splineRefs={splineRefs}
                      componentRef1id={item.id}
                      componentRef2id={connectedId}
                    />
                  );
                }
              })
            ))}
          </React.Fragment>
          : // non found
          <div>
            No pets found.
          </div>
      )
        : // loading animation
        <div className="text-6xl text-center mt-36">
          Loading...
        </div>
      }
    </div>
  );
};

export default AnimalPedigree;