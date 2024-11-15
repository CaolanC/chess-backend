const enum Routes {
    HOME = '/',
    REGISTER = '/register/:username', // HACK this has to be hardcoded to pick a specific argument
    NAME = '/name',

    CREATE = '/create-game', // TODO update this endpoint's name to match a new scheme
    JOIN = '/join/:room_id',

    ROOM = '/room', // can construct from these separate bits
    ROOM_ID = '/:room_id',
};

export default Routes;