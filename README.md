sticky-notes-server
===================

Uni sticky notes app nodejs server

SETUP
=====
Go into the app folder and type "npm install"

REST
====

endpoint - http://stickyapi.alanedwardes.com/1.0 // API version

POST /user/login
username=user&password=pass

Sucessful response:
{
	session: session object containing token ID,
	user: user object
}

Error codes: 403

POST/user/register
firstName, surname, password, email
success: 201
error: 500
invalid: 400

Get user object
/user/get/:id
Sucessful response:
{
	id:10000000001,
        firstName: 'Cool',
        surname: 'McRomance',
        email: 'test@testmail.com',
}

Error codes: 401

----------------------------------------------------

All other API methods require a token to be POSTed

POST /notes/list
token=token - Just pass in the user id here for now

Token identifies current user in this case.

Sucessful response:
{
	notes: [{
		// Note 1
	},
	{
		// Note 2, etc...
	}]
}

POST /notes/save
{
	body: text
	token: token,
}
success: 201, error: 500

MODELS
======
----------------------
 User
----------------------
id			Int(11)
frstName	Text(255)
surname		Text(255)
email		Text(255)
password	Text(255)

----------------------
 Note
----------------------
id			Int(11)
body		Text
created		DateTime
author		Int FK User(11)

----------------------
 Session
----------------------
id			Int(11)
token		Text(255)
user		Int FK User(11)
created		DateTime