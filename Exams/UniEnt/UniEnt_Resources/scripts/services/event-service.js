const eventService = (() => {

    function getAllEvents() {
        return kinvey.get('appdata', 'events', 'kinvey', `?query={}&sort={"peopleInterestedIn": -1}`);
    }

    function createEvent(data) {
        return kinvey.post('appdata', 'events', 'kinvey', data)
    }

    function getAEvent(id) {
        return kinvey.get('appdata', `events/${id}`, 'kinvey');
    }

    function editMyEvent(id, event) {
        return kinvey.update('appdata', `events/${id}`, 'kinvey', event);
    }

    function joinEvent(id, event) {
        return kinvey.update('appdata', `events/${id}`, 'kinvey', event);
    }

    function deleteEvent(id) {
        return kinvey.remove('appdata', `events/${id}`, 'kinvey');
    }



    return {
        createEvent,
        getAllEvents,
        getAEvent,
        editMyEvent,
        joinEvent,
        deleteEvent
    }
})()