exports.requestHandler = function(express, app)
{
    var userBusiness = require('../business/userBusiness');
    var noteBusiness = require('../business/noteBusiness');
    app.use(app.router);

    // Allow cross origin
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    // User operations
    app.get('/user/:id', userBusiness.onGetUserDataRequest);
    app.post('/user/register', userBusiness.onRegisterUserRequest);
    app.post('/user/login', userBusiness.onLoginRequest);

    // Note operations
    app.post('/notes/list', noteBusiness.onListNotesForUserRequest);
    app.post('/notes/save', noteBusiness.onPersistNoteRequest);
    app.post('/notes/delete', noteBusiness.onDeleteNoteRequest);
}