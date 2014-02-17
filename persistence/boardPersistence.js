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