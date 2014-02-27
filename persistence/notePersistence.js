var orm = require('../orm');

exports.findNotesByAuthor = function(userID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.findAll({
        where: { author: userID, board_id: null}
    }).error(function(err)
        {
            return callback(err);
        }).success(function(notes)
        {
            return callback(null, notes);
        });
};

exports.findNotesByBoardID = function(boardID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.findAll({
        where: { board_id: boardID }
    }).error(function(err)
        {
            return callback(err);
        }).success(function(notes)
        {
            return callback(null, notes);
        });
};

exports.createNote = function(boardID, title, body, userID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.build({
        board_id: boardID,
        title: title,
        body: body,
        created: new Date(),
        author: userID
    }).save().error(function(err)
        {
            return callback(err);
        }).success(function(note)
        {
            return callback(null, note);
        });
}

exports.removeNoteByID = function(noteID, authorID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.find({where: { id: noteID, author: authorID }}).error(function(error)
    {
        return callback(error);

    }).success(function(note)
        {
            if (!note)
            {
                return callback(null);
            }

            note.destroy().error(function(err)
            {
                return callback(err);

            }).success(function()
                {
                    return callback(null);
                })
        });
}

exports.updateNoteById = function(noteID, authorID, title, body, callback)
{
    var noteModel = orm.model('Note');

    var parameters =
    {
        title: title,
        body: body
    }

    var criteria =
    {
        id: noteID,
        author: authorID
    }

    noteModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
};