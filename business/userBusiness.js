var passwordHash = require('password-hash');
var validator = require('validator');

var util = require('../util');
var userPersistence = require('../persistence/userPersistence');
var sessionPersistence = require('../persistence/sessionPersistence');

exports.onGetUserDataRequest = function (req, res)
{
    var id = req.body.id;
    var token = req.body.token;

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

        userPersistence.getUserByID(id, userDataReturnedHandler);

        function userDataReturnedHandler(err, user)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error retrieving user data'});
                return;
            }

            if (!user)
            {
                res.send(401, {message: 'Unknown ID'});
                return;
            }

            res.send(200, user);
        }
    }
};

exports.onLoginRequest = function (req, res)
{
	var username = req.body.username;
	var password = req.body.password;

    userPersistence.getUserByEmail(username, userDataReturnedHandler);

    function userDataReturnedHandler(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error retrieving user data'});
            return;
        }

		if (!user)
		{
            res.send(403, {message: 'Invalid credentials'});
			return;
		}

		if (!passwordHash.verify(password, user.dataValues.password))
		{
            res.send(403, {message: 'Invalid credentials'});
			return;
		}

        sessionPersistence.createSession(user.id, sessionSavedHandler);

        function sessionSavedHandler(err, session)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error setting up user session'});
                return;
            }

            var result =
            {
                session:
                {
                    id: session.token,
                    created: new Date()
                },
                user: user
            };

            res.send(200, result);
        }

	}
};

exports.onRegisterUserRequest = function(req, res)
{
	var firstName = req.body.firstName;
	var surname = req.body.surname;
	var password = req.body.password;
	var email = req.body.email;

    var inputValidationResult = validateRegistrationInput(email, password, firstName, surname);

    if (!inputValidationResult.valid)
    {
        res.send(400, {message: inputValidationResult.message});
        return;
    }

    userPersistence.getUserByEmail(email, function(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!util.isNullOrUndefined(user))
        {
            res.send(409, {message: 'Email already registered'});
            return;
        }

        var hashedPassword = passwordHash.generate(password, {algorithm: 'sha512'});

        userPersistence.createUser(firstName, surname, email, hashedPassword, userSavedHandler);
    });

    function userSavedHandler(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error registering user'});
            return;
        }

        res.send(201, user);
    }
};

exports.onEditUserDetailsRequest = function(req, res)
{
    var firstName = req.body.firstName;
    var surname = req.body.surname;
    var email = req.body.email;
    var token = req.body.token;

    var inputValidationResult = validateEditUserDetailsInput(email, firstName, surname);

    if (!inputValidationResult.valid)
    {
        res.send(400, {message: inputValidationResult.message});
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

        userPersistence.updateUserDetailsByID(session.user, firstName, surname, email, function(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, {message: 'Error updating user'});
                return;
            }

            res.send(200, {});
        });
    }
};

exports.onEditUserPasswordRequest = function(req, res)
{
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    var password2 = req.body.password2;
    var token = req.cookies.token;

    if (password !== password2)
    {
        res.send(400, {message: 'New passwords do not match'});
        return;
    }

    var passwordInputResult = validatePasswordInput(password);

    if (!passwordInputResult.valid)
    {
        res.send(400, {message: passwordInputResult.message});
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

        userPersistence.getUserByID(session.user, userReturnedHandler)
    }

    function userReturnedHandler(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error getting user'});
            return;
        }

        if (!passwordHash.verify(oldPassword, user.password))
        {
            res.send(403, {message: 'Old password invalid'});
            return;
        }

        var hashedPassword = passwordHash.generate(password, {algorithm: 'sha512'});

        userPersistence.updateUserPasswordByID(user.id, hashedPassword, passwordChangedHandler)

    }

    function passwordChangedHandler(err)
    {
        if (err)
        {
            console.log(err);
            res.send(500, {message: 'Error changing password'});
            return;
        }

        res.send(200, {});
    }
}

function validateRegistrationInput(email, password, firstName, surname)
{
    var result = {
        valid: true,
        message: ""
    };

    var emailInputResult = validateEmailInput(email);

    if (!emailInputResult.valid)
    {
        result.valid = false;
        result.message = emailInputResult.message;
        return result;
    }

    var passwordInputResult = validatePasswordInput(password);

    if (!passwordInputResult.valid)
    {
        result.valid = false;
        result.message = passwordInputResult.message;
        return result;
    }

    var nameInputResult = validateName(firstName, surname);

    if (!nameInputResult.valid)
    {
        result.valid = false;
        result.message = nameInputResult.message;
        return result;
    }

    return result;
}

function validateEditUserDetailsInput(email, firstName, surname)
{
    var result = {
        valid: true,
        message: ""
    };

    var emailInputResult = validateEmailInput(email);

    if (!emailInputResult.valid)
    {
        result.valid = false;
        result.message = emailInputResult.message;
        return result;
    }

    var nameInputResult = validateName(firstName, surname);

    if (!nameInputResult.valid)
    {
        result.valid = false;
        result.message = nameInputResult.message;
        return result;
    }

    return result;
}

function validateEmailInput(email)
{
    var result =
    {
        valid: true,
        message: ""
    };

    if (!util.isString(email))
    {
        result.message += 'Invalid email.';
        result.valid = false;
        return result;
    }

    if (!validator.isEmail(email))
    {
        result.message += 'Invalid email.';
        result.valid = false;
    }

    return result;
}

function validatePasswordInput(password)
{
    var result =
    {
        valid: true,
        message: ""
    };

    if (!util.isString(password))
    {
        result.message += 'Invalid password.';
        result.valid = false;
        return result;
    }

    if (!validator.isLength(password, 5, 25))
    {
        result.message += 'Password needs to be between 5 and 25 characters';
        result.valid = false;
        return result;
    }

    return result;
}

function validateName(firstName, surname)
{
    var result =
    {
        valid: true,
        message: ""
    };

    // These are optional fields, but just making sure they are strings
    if (!util.isString(firstName) || !util.isString(surname))
    {
        result.message += 'Invalid name';
        result.valid = false;
        return result;
    }

    return result;
}