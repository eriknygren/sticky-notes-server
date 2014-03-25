var orm = require('../orm');

exports.getBoardsForUser = function(userID, callback)
{
    var boardUserModel = orm.model('Board_User');
    var boardModel = orm.model('Board');
    var boardIDs = [];

    boardUserModel.findAll({
        where: { user_id: userID }
    }).error(function(err)
        {
            return callback(err);

        }).success(function(boardUserLinks)
        {
            for (var i=0; i < boardUserLinks.length; i++)
            {
                boardIDs.push(boardUserLinks[i].board_id);
            }

            boardModel.findAll({
                where: {id: boardIDs}
            }).error(function(err)
                {
                    return callback(err);

                }).success(function(boards)
                {
                    return callback(null, boards);
                });
        });
};

exports.createBoard = function (ownerUserID, name, callback) {
    var boardUserModel = orm.model('Board_User');
    var boardModel = orm.model('Board');

    boardModel.build({
        owner_user_id: ownerUserID,
        name: name
    }).save().error(function (err) {

            return callback(err);

        }).success(function (board) {

            // Add entry in link table
            boardUserModel.build({
                board_id: board.dataValues.id,
                user_id: ownerUserID
            }).save().error(function (err) {

                    return callback(err);

                }).success(function (boardUserLink)
                {
                    return callback(null, board);
                });
        });
};

exports.addUserToBoard = function(boardID, userID, callback)
{
    var boardUserModel = orm.model('Board_User');

    boardUserModel.build({
        board_id: boardID,
        user_id: userID
    }).save().error(function (err) {

            return callback(err);

        }).success(function (boardUserLink)
        {
            return callback(null, boardUserLink);
        });
};

exports.getBoardByID = function(boardID, callback)
{
    var boardModel = orm.model('Board');
    boardModel.find({ where: {id: boardID} }).error(function (err)
    {
        return callback(err);
    }).success(function (board)
        {
            return callback(null, board);
        });
};

exports.getBoardUserLink = function(boardID, userID, callback)
{
    var boardUserModel = orm.model('Board_User');
    boardUserModel.find({ where: {board_id: boardID, user_id: userID} }).error(function (err)
    {
        return callback(err);
    }).success(function (boardUserLink)
        {
            return callback(null, boardUserLink);
        });
};

exports.removeBoardByID = function(boardID, callback)
{
    var boardModel = orm.model('Board');

    boardModel.find({where: { id: boardID }}).error(function(error)
    {
        return callback(error);

    }).success(function(board)
        {
            if (!board)
            {
                return callback(null);
            }

            board.destroy().error(function(err)
            {
                return callback(err);

            }).success(function()
                {
                    removeBoardLinkTableEntries(boardID);
                    return callback(null);
                })
        });
};

exports.removeBoardUserLink = function(boardID, userID, callback)
{
    var boardUserModel = orm.model('Board_User');

    boardUserModel.find({where: { board_id: boardID, user_id: userID }}).error(function(error)
    {
        return callback(error);

    }).success(function(boardUserLink)
        {
            if (!boardUserLink)
            {
                return callback(null);
            }

            boardUserLink.destroy().error(function(err)
            {
                return callback(err);

            }).success(function()
                {
                    return callback(null);
                })
        });
};

function removeBoardLinkTableEntries(boardID)
{
    var boardUserModel = orm.model('Board_User');

    boardUserModel.destroy({ board_id: boardID })
        .error(function(err)
        {
            console.log(err);

        }).success(function(affectedRows)
            {
                console.log('Deleted ' + affectedRows + ' rows.');

            });
};