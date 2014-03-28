var orm = require('../orm');

exports.getUserByID = function(userID, callback)
{
    var userModel = orm.model('User');
    userModel.find({ where: {id: userID} }).error(function (err)
    {
        return callback(err);
    }).success(function (user)
        {
            return callback(null, user);
        });
};

exports.getUserByEmail = function(email, callback)
{
    var userModel = orm.model('User');
    userModel.find({ where: {email: email} }).error(function (err)
    {
        return callback(err);
    }).success(function (user)
        {
            return callback(null, user);
        });
};

exports.getUsersForBoard = function(boardID, callback)
{
    var boardUserModel = orm.model('Board_User');
    var userModel = orm.model('User');
    var userIDs = [];

    boardUserModel.findAll({
        where: { board_id: boardID }
    }).error(function(err)
        {
            return callback(err);

        }).success(function(boardUserLinks)
        {
            for (var i=0; i < boardUserLinks.length; i++)
            {
                userIDs.push(boardUserLinks[i].user_id);
            }

            userModel.findAll({
                where: {id: userIDs}
            }).error(function(err)
                {
                    return callback(err);

                }).success(function(users)
                {
                    return callback(null, users);
                });
        });
};

exports.createUser = function(firstName, surname, email, hashedPassword, callback)
{
    var userModel = orm.model('User');

    userModel.build({
        first_name: firstName,
        surname: surname,
        email: email,
        password: hashedPassword})
        .save().error(function(err)
        {
            return callback(err);
        }).success(function(user)
        {
            return callback(null, user);
        });
};

exports.updateUserDetailsByID = function(userID, firstName, surname, email, callback)
{
    var userModel = orm.model('User');

    var parameters =
    {
        first_name: firstName,
        surname: surname,
        email: email
    };

    var criteria =
    {
        id: userID
    };

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
};

exports.updateUserPasswordByID = function(userID, password, callback)
{
    var userModel = orm.model('User');

    var parameters =
    {
        password: password
    };

    var criteria =
    {
        id: userID
    };

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
};