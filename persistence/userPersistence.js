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

exports.createUser = function(firstName, surname, email, hashedPassword, callback)
{
    var userModel = orm.model('User');

    userModel.build({
        firstName: firstName,
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
        firstName: firstName,
        surname: surname,
        email: email
    }

    var criteria =
    {
        id: userID
    }

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
    }

    var criteria =
    {
        id: userID
    }

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
};