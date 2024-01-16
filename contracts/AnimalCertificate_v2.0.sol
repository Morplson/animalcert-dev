// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./openzepellin/token/ERC721/ERC721.sol";

// A contract is a collection of functions and data (its state).
// Once deployed, a contract resides at a specific address on the Ethereum blockchain.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/structure-of-a-contract.html
contract AnimalCertificate is ERC721
{
    enum Species {
        Dog, // 0
        Cat, // 1
        Horse,
        Ferret,
        Hamster,
        GuineaPig,
        Rabbit,
        Turtle,
        Snail
    }

    enum Color {
        Black,
        White,
        Brown,
        Grey,
        Red,
        Orange
    }

    enum Gender {
        Female,
        Male
    }

    enum Disease {
        Arthritis,
        ChronicKidneyDisease,
        Hepatitis,
        DiabetesMellitus,
        CushingDisease,
        AddisonDisease,
        Cancer,
        Hyperthyroidism,
        Atopy
    }

    struct Animal {
        uint id;
        uint mother;
        uint father;
        uint matePartner;
        bool pregnant;
        Species  species;
        string breed;
        Gender  gender;
        uint[] diseases;
        uint256 dateOfBirth;
        uint256 dateOfDeath;
        Color furColor;
    }

    Animal[] public animals;

    constructor() ERC721("AnimalCertificate", "ANIMAL_CERTIFICATE") {}

    function mint(Gender _gender, Species _species, string memory _breed, uint256 _dateOfBirth, Disease[] memory _diseases, Color _furColor) public {
        Animal memory animal;
        animal.gender = _gender;
        animal.species = _species;
        animal.breed = _breed;
        animal.dateOfBirth = _dateOfBirth;
        animal.id = animals.length;
        animal.furColor = _furColor;
        animal.matePartner = animals.length;

        uint diseaseArrayLength = _diseases.length;
        animal.diseases = new uint[](diseaseArrayLength);
        for(uint i = 0; i < diseaseArrayLength; i++){
            animal.diseases[i] = uint(_diseases[i]);
        }

        uint256 newAnimalIndex = animals.length;
        animals.push(animal);
        uint256 _id = newAnimalIndex;

        _mint(msg.sender, _id);
    }

    function mint(Gender _gender, Species _species, string memory _breed, uint256 _dateOfBirth, uint _mother, uint _father, Disease[] memory _diseases, Color _furColor) private {
        Animal memory animal ;
        animal.gender = _gender;
        animal.species = _species;
        animal.breed = _breed;
        animal.dateOfBirth = _dateOfBirth;
        animal.mother = _mother;
        animal.father = _father;
        animal.id =  animals.length;
        animal.furColor = _furColor;
        animal.matePartner = animals.length;

        uint diseaseArrayLength = _diseases.length;
        animal.diseases = new uint[](diseaseArrayLength);
        for(uint i = 0; i < diseaseArrayLength; i++){
            animal.diseases[i] = uint(_diseases[i]);
        }

        uint256 newAnimalIndex = animals.length;
        animals.push(animal);
        uint256 _id = newAnimalIndex;

        _mint(msg.sender, _id);
    }

    function getAnimal(uint _id) public view returns (Animal memory) {
        require(_id < animals.length, "Invalid animal ID");
        Animal storage animal = animals[_id];
        return animal;
    }

    function totalSupply() public view returns (uint) {
        return animals.length;
    }

    function confirmPregnancy( uint _tokenIdFemale, uint _tokenIdMale) public {
        Animal storage male = animals[_tokenIdMale];
        require(male.gender == Gender.Male, "requested male is not male");

        // in future a more advanced algorithm should be used to also mate with partners of different owners with a confirmation system
        require(ownerOf(_tokenIdFemale) == msg.sender, "Female animal is not owned by requesting user");
        require(ownerOf(_tokenIdMale) == msg.sender, "Male animal is not owned by requesting user");

        Animal storage female = animals[_tokenIdFemale];
        require(female.gender == Gender.Female, "Requested female is not female");
        require(male.species == female.species, "Can't mix species!");
        require(female.pregnant == false, "Female is already pregnant");

        require(female.dateOfDeath == 0, "Can't confirm pregancy when dead");
        require(male.dateOfDeath == 0, "Can't mate with dead father animal");

        female.pregnant = true;
        female.matePartner = _tokenIdMale;
    }

    function abortPregnancy(uint _tokenIdFemale) public {
        require(ownerOf(_tokenIdFemale) == msg.sender, "animal is not owned by Requestor");
        Animal storage female = animals[_tokenIdFemale];
        require(female.dateOfDeath == 0, "can't abort pregancy of dead animal");

        female.pregnant = false;
        female.matePartner = _tokenIdFemale;
    }

    function addDisease(uint _tokenId, Disease _disease) public {
        require(ownerOf(_tokenId) == msg.sender, "animal is not owned by Requestor");
        Animal storage animal = animals[_tokenId];
        require(animal.dateOfDeath == 0, "can't add illness to dead animal");

        bool hasThisDisease = false;
        uint diseaseIntegerValue = uint(_disease);

        for(uint i = 0; i < animal.diseases.length; i++) {
            if(animal.diseases[i] == diseaseIntegerValue) {
                hasThisDisease = true;
                break;
            }
        }

        require(hasThisDisease == false, "Animal does already have this illness");

        uint newArrayLength = animal.diseases.length + 1;
        uint[] memory newDiseases = new uint[](newArrayLength);

        for(uint i = 0; i < animal.diseases.length; i++) {
            newDiseases[i] = animal.diseases[i];
        }

        newDiseases[newArrayLength - 1] = uint(_disease);

        animal.diseases = newDiseases;
    }

    function death(uint _tokenId, uint256 _dateOfDeath) public {
        require(ownerOf(_tokenId) == msg.sender, "animal is not owned by Requestor");
        Animal storage animal = animals[_tokenId];

        animal.pregnant = false;
        animal.matePartner = _tokenId;

        animal.dateOfDeath = _dateOfDeath;
    }

    function birth(uint _tokenId, string[] memory _femaleNames, string[] memory _maleNames, Color _furColor) public {
        require(ownerOf(_tokenId) == msg.sender, "Animal is not owned by Requestor");
        Animal storage animal = animals[_tokenId];
        require(animal.dateOfDeath == 0, "Can't give birth when dead");
        require(animal.pregnant == true, "Can't give birth when not pregnant");

        for (uint i = 0; i < _femaleNames.length; i++) {
            mint(Gender.Female, animal.species, _femaleNames[i], block.timestamp, _tokenId, animal.matePartner, new Disease[](0), _furColor);
        }

        for (uint i = 0; i < _maleNames.length; i++) {
            mint(Gender.Male, animal.species, _maleNames[i], block.timestamp, _tokenId, animal.matePartner, new Disease[](0), _furColor);
        }

        animal.pregnant = false;
        animal.matePartner = 0;
    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256) {
        require(_index < balanceOf(_owner), "Index out of bounds");

        for (uint256 i = 0; i < totalSupply(); i++) {
            if (ownerOf(i) == _owner) {
                if (_index == 0) {
                    return i;
                }
                _index--;
            }
        }

        revert("No token found for the given index");
    }
}