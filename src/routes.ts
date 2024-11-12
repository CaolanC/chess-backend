const enum Routes {
    HOME = '/',
    REGISTER = '/register/:username', // HACK this has to be hardcoded to pick a specific argument
    CREATE = '/create',
    JOIN = '/join/:room_id',
    ROOM = '/room/:room_id',
};

export default Routes;