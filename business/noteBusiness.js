var sessionPersistence = require('../persistence/sessionPersistence');
var notePersistence = require('../persistence/notePersistence');

var util = require('../util');
var validator = require('validator');

exports.onListNotesRequest = function(req, res)
{
	var token = req.body.token;

    var boardID = req.body.boardID;

    if (util.isNullOrUndefined(boardID))
    {
        boardID = null;
    }

    if (!validator.isInt(boardID))
    {
        boardID = null;
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

        if (!boardID)
        {
            notePersistence.findNotesByAuthor(session.user, notesReturnedHandler);
        }
        else
        {
            // TODO confirm user is linked to board
            notePersistence.findNotesByBoardID(boardID, notesReturnedHandler);
        }

        function notesReturnedHandler(err, notes)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error retrieving notes'});
                return;
            }

            res.send(200, { notes: notes});
        }
    }
};

exports.onPersistNoteRequest = function(req, res)
{
	var body = req.body.body;
    var title = req.body.title;
	var token = req.body.token;
    var boardID = req.body.boardID;

    if (util.isNullOrUndefined(boardID))
    {
        boardID = null;
    }

    if (!validator.isInt(boardID))
    {
        boardID = null;
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

        notePersistence.createNote(boardID, title, body, session.user, noteSavedHandler);

        function noteSavedHandler(err, note)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error saving note'});
                return;
            }

            // Respond with the saved note
            res.send(201, note);
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
            console.log(err);
            res.send(500, {message: 'Error getting session'});
            return;
        }

        if (!session)
        {
            res.send(401, {message: 'Unknown session'});
            return;
        }

        notePersistence.removeNoteByID(id, session.user, noteDeletedHandler);

        function noteDeletedHandler(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error deleting note'});
                return;
            }

            res.send(200, {});
        }
    }
}

exports.onEditNoteRequest = function(req, res)
{
    var body = req.body.body;
    var title = req.body.title;
    var token = req.body.token;
    var id = req.body.id;

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

        notePersistence.updateNoteById(id, session.user, title, body, noteEditedHandler);

        function noteEditedHandler(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error editing note'});
                return;
            }

            res.send(200, {});
        }
    }
};