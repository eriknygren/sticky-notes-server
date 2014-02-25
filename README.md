sticky-notes-server
===================

Sticky notes app Nodejs server

SETUP
=====
1. Go into the app folder
2. Type "npm install"

REST
====

**endpoint** - *http://stickyapi.alanedwardes.com/1.0* // API version

If a successful response isn't returned, an error message is available in response.message

**POST /user/login**

username=user&password=pass

Sucessful response:

    {
    	session: session object containing token ID,
    	user: user object
    }

Error codes: 403

**POST /user/register**

firstName, surname, password, email

success: 201

error: 500

invalid: 400

**GET user object**

**/user/get/:id**

Sucessful response:

    {
	    id:10000000001,
	    firstName: 'Cool',
	    surname: 'McRomance',
	    email: 'test@testmail.com'
    }

Error codes: 401

----------------------------------------------------

**All other API methods require a token to be POSTed**

**POST /notes/list**

token=token
boardID = board id for notes to list (not passing a board id returns private notes)

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

**POST /notes/save**

    {
    	title: text (nullable),
		body: text,
    	token: token
		boardID: boardID (null == private/unassigned note)
    }

Returns saved note object

success: 201, error: 500

**POST /notes/delete**

    {
	    id: note id,
	    token: token
    }

success: 200, error: 500

**POST /boards/save**

	{
	    name: board name,
	    token: token
    }

*Sucessful response returns board object*

**POST /boards/list**

List boards for user

	{
	    token: token
    }

Sucessful response:
    
	{
    	boards: [{
    		// Board 1
    	},
    	{
    		// Board 2, etc...
    	}]
    	
    }

**POST /boards/delete**

    {
	    id: board id,
	    token: token
    }

success: 200, error: 500

MODELS
======

 User
----------------------
    id			Int(11)
    firstName	Text(255)
    surname		Text(255)
    email		Text(255)
    password	Text(255)

 Note
----------------------
    id			Int(11)
    board_id	Int(11) (null == private note (default))
	title		Text (nullable)
    body		Text
    created		DateTime
    author		Int FK User(11)


 Session
----------------------
    id			Int(11)
    token		Text(255)
    user		Int FK User(11)
    created		DateTime


 Board
----------------------
    id				Int(11)
    owner_user_id	Int FK User(11)
    name			Text(255)


 Board_User
----------------------
    user_id		Int FK User(11)
    board_id	Int FK Board(11)
