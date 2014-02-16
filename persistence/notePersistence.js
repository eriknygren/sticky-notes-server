var orm = require('../orm');

exports.findNotesByAuthor = function(userID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.findAll({
        where: { author: userID }
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

exports.createNote = function(boardID, body, userID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.build({
        board_id: boardID,
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

exports.removeNoteByID = function(noteID, callback)
{
    var noteModel = orm.model('Note');

    noteModel.find({where: { id: noteID }}).error(function(error)
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
