const petService = (() => {

    function getAllPets() {
         return kinvey.get('appdata', 'pets', 'kinvey', `?query={}&sort={"likes": -1}`);
     }
    function createPet(data) {
        return kinvey.post('appdata', 'pets', 'kinvey', data)
    }

    function getMyPets() {
        return kinvey.get('appdata', 'pets', 'kinvey', `?query={"_acl.creator":"${sessionStorage.getItem('id')}"}`);
    }

    function getAPet(id) {
        return kinvey.get('appdata', `pets/${id}`, 'kinvey');
    }

    function likePet(id, pet) {
        return kinvey.update('appdata', `pets/${id}`, 'kinvey', pet);
    }

    function editMyPetInfo(id, pet) {
        return kinvey.update('appdata', `pets/${id}`, 'kinvey', pet);
    }

    function deletePet(id) {
        return kinvey.remove('appdata', `pets/${id}`, 'kinvey');
    }



    return {
        createPet,
        getAllPets,
        getMyPets,
        getAPet,
        likePet,
        editMyPetInfo,
        deletePet
    }
})()