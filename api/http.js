exports.requestHandler = function(express, app)
{
    var userBusiness = require('../business/userBusiness');
    var noteBusiness = require('../business/noteBusiness');
    var boardBusiness = require('../business/boardBusiness');
    app.use(app.router);

    // Allow cross origin
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    // User operations
    app.post('/user/getUser', userBusiness.onGetUserDataRequest);
    app.post('/user/register', userBusiness.onRegisterUserRequest);
    app.post('/user/login', userBusiness.onLoginRequest);
    app.post('/user/editDetails', userBusiness.onEditUserDetailsRequest);
    app.post('/user/editPassword', userBusiness.onEditUserPasswordRequest);

    // Note operations
    app.post('/notes/list', noteBusiness.onListNotesRequest);
    app.post('/notes/save', noteBusiness.onPersistNoteRequest);
    app.post('/notes/delete', noteBusiness.onDeleteNoteRequest);
    app.post('/notes/edit', noteBusiness.onEditNoteRequest);

    // Board operations
    app.post('/boards/save', boardBusiness.onCreateBoardRequest);
    app.post('/boards/list', boardBusiness.onListBoardsForUserRequest);
    app.post('/boards/delete', boardBusiness.onDeleteBoardRequest);
    app.post('/boards/leave', boardBusiness.onLeaveBoardRequest);
    app.post('/board/addUser', boardBusiness.onAddUserToBoardRequest);
    app.post('/board/getUsers', boardBusiness.onGetUsersForBoardRequest);
}