var sessionPersistence = require('../persistence/sessionPersistence');
var notePersistence = require('../persistence/notePersistence');

var util = require('../util');

//TODO this needs to include notes for all boards as well
exports.onListNotesForUserRequest = function(req, res)
{
	var token = req.body.token;

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log('Error getting session');
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!session)
        {
            console.log('Unknown session');
            res.send(401, {});
            return;
        }

        notePersistence.findNotesByAuthor(session.user, notesReturnedHandler);

        function notesReturnedHandler(err, notes)
        {
            if (err)
            {
                console.log('Error retrieving notes');
                console.log(err);
                res.send(500, {});
                return;
            }

            res.send(200, notes);
        }
    }
};

exports.onListNotesForBoardRequest = function(req, res)
{
    var token = req.body.token;
    var boardID = req.body.boardID;

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log('Error getting session');
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!session)
        {
            console.log('Unknown session');
            res.send(401, {});
            return;
        }

        // TODO confirm user is linked to board
        notePersistence.findNotesByBoardID(boardID, notesReturnedHandler);

        function notesReturnedHandler(err, notes)
        {
            if (err)
            {
                console.log('Error retrieving notes');
                console.log(err);
                res.send(500, {});
                return;
            }

            res.send(200, notes);
        }
    }
};

exports.onPersistNoteRequest = function(req, res)
{
	var body = req.body.body;
	var token = req.body.token;
    var boardID = req.body.boardID;

    if (util.isNullOrUndefined(boardID))
    {
        boardID = null;
    }

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log('Error getting session');
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!session)
        {
            console.log('Unknown session');
            res.send(401, {});
            return;
        }

        notePersistence.createNote(boardID, body, session.user, noteSavedHandler);

        function noteSavedHandler(err, note)
        {
            if (err)
            {
                console.log('Error saving note');
                console.log(err);
                res.send(500, {});
                return;
            }

            // Respond with the ID of the saved note
            res.send(201, note.dataValues.id);
        }
    }
};

exports.onDeleteNoteRequest = function(req, res)
{
    var token = req.body.token;
    var id = req.body.id;

    sessionPersistence.getSessionByToken(token, sessionDataReturnedHandler)

    function sessionDataReturnedHandler(err, session)
    {
        if (err)
        {
            console.log('Error getting session');
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!session)
        {
            console.log('Unknown session');
            res.send(401, {});
            return;
        }

        notePersistence.removeNoteByID(id, noteDeletedHandler);

        function noteDeletedHandler(err)
        {
            if (err)
            {
                console.log('Error deleting note');
                console.log(err);
                res.send(500, {});
                return;
            }

            res.send(200, {});
        }
    }
}