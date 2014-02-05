var passwordHash = require('password-hash');
var validator = require('validator');

var util = require('../util');
var userPersistence = require('../persistence/userPersistence');
var sessionPersistence = require('../persistence/sessionPersistence');

exports.onGetUserDataRequest = function (req, res)
{
	var id = req.params.id;

    userPersistence.getUserByID(id, userDataReturnedHandler);

    function userDataReturnedHandler(err, user)
    {
        if (err)
        {
            console.log('Error retrieving user data');
            console.log(err);
            res.send(500, {});
            return;
        }

        if (!user)
        {
            console.log('Unknown ID');
            res.send(401, {});
            return;
        }

        res.send(200, user);
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
            console.log('Error retrieving user data');
            console.log(err);
            res.send(500, {});
            return;
        }

		if (!user)
		{
            console.log('Invalid credentials');
            res.send(403, {});
			return;
		}

		if (!passwordHash.verify(password, user.dataValues.password))
		{
            console.log('Invalid credentials');
            res.send(403, {});
			return;
		}

        sessionPersistence.createSession(user.id, sessionSavedHandler);

        function sessionSavedHandler(err, session)
        {
            if (err)
            {
                console.log('Error setting up user session');
                console.log(err);
                res.send(500, {});
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

	var hashedPassword = passwordHash.generate(password, {algorithm: 'sha512'});

    userPersistence.createUser(firstName, surname, email, hashedPassword, userSavedHandler);

    function userSavedHandler(err, user)
    {
        if (err)
        {
            console.log("Error registering user");
            console.log(err);
            res.send(500, {});
            return;
        }

        res.send(201, user);
    }
};

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