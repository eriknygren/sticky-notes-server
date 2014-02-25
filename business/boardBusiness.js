var sessionPersistence = require('../persistence/sessionPersistence');
var boardPersistence = require('../persistence/boardPersistence');

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