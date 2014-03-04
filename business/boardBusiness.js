var sessionPersistence = require('../persistence/sessionPersistence');
var boardPersistence = require('../persistence/boardPersistence');
var userPersistence = require('../persistence/userPersistence');
var validator = require('validator');
var util = require('../util');

exports.onCreateBoardRequest = function(req, res)
{
    var token = req.body.token;
    var name = req.body.name;

    //TODO validate name

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler);

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting session'});
            return;
        }

        if (!session)
        {
            res.send(401, {message: 'Unknown session'});
            return;
        }

        boardPersistence.createBoard(session.user, name, boardSavedHandler);

        function boardSavedHandler(err, board)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error saving board'});
                return;
            }

            // Respond with the saved board
            res.send(201, board);
        }
    }
};

exports.onListBoardsForUserRequest = function(req, res)
{
    var token = req.body.token;

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler);

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting session'});
            return;
        }

        if (!session)
        {
            res.send(401, {message: 'Unknown session'});
            return;
        }

        boardPersistence.getBoardsForUser(session.user, boardsReturnedHandler);

        function boardsReturnedHandler(err, boards)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error retrieving boards'});
                return;
            }

            res.send(200, {boards: boards});
        }
    }
};

exports.onDeleteBoardRequest = function(req, res)
{
    var token = req.body.token;
    var id = req.body.id;

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting session'});
            return;
        }

        if (!session)
        {
            res.send(401, {message: 'Unknown session'});
            return;
        }

        boardPersistence.getBoardByID(id, boardReturnedHandler);


        function boardReturnedHandler(err, board)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error getting board'});
                return;
            }

            if (session.user !== board.owner_user_id)
            {
                res.send(403, {message: 'Cannot delete board you do not own'});
                return;
            }

            boardPersistence.removeBoardByID(id, boardDeletedHandler);
        }

        function boardDeletedHandler(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error deleting board'});
                return;
            }

            res.send(200, {});
        }
    }
};

exports.onAddUserToBoardRequest = function(req, res)
{
    var token = req.body.token;
    var boardID = req.body.boardID;
    var email = req.body.email;

    if (!validator.isEmail(email))
    {
        res.send(400, {message: 'Invalid email'});
        return;
    }

    if (util.isNullOrUndefined(boardID))
    {
        res.send(400, {message: 'Supply a valid board id'});
        return;
    }

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting session'});
            return;
        }

        if (!session)
        {
            res.send(401, {message: 'Unknown session'});
            return;
        }

        boardPersistence.getBoardByID(boardID, boardReturnedHandler);
    }

    function boardReturnedHandler(err, board)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting board'});
            return;
        }

        if (!board)
        {
            res.send(401, {message: 'Unknown board'});
            return;
        }

        userPersistence.getUserByEmail(email, userReturnedHandler);
    }

    function userReturnedHandler(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting user'});
            return;
        }

        if (!user)
        {
            res.send(401, {message: 'Email not registered'});
            return;
        }

        boardPersistence.addUserToBoard(boardID, user.id, userAddedToBoardHandler);
    }

    function userAddedToBoardHandler(err, boardUserLink)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error adding user to board'});
            return;
        }

        res.send(201, boardUserLink);
    }
};