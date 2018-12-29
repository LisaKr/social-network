const express = require("express");
const app = express();
//like a wrapper for our server, which is saying that socket will be listening for connections
const server = require('http').Server(app);
//listening to connections from localserver ( || or your website)
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require("compression");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const cookieSession = require('cookie-session');
const db = require("./db.js");

///////////////////////////do not touch/////////////////////////////////
//takes the file we sent, gives it a name, and puts it in the uploads directory
//multer takes the sent file and puts it in the upload folder
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

const s3 = require("./s3.js");

const config = require("./config.json");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        //generates an unique name for all files
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
////////////////////////////////end of do not touch/////////////////////////////////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session secret is a key used for signing and/or encrypting cookies set by the application to maintain session state
const cookieSessionMiddleware = cookieSession({
    secret: process.env.COOKIE_SECRET || require("./secrets.json").cookieSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//protecting from cross-site requests, used after cookies and bodyParser
app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(express.static("./public"));
app.use(express.static("./uploads"));


app.use(compression());

app.disable("x-powered-by");


if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}


///////////////////////BASIC REDIRECTION/////////////////////
app.get("/welcome", needNoUserID, (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/", needUserID, (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

///////////////////////////REGISTRATION, LOG IN, LOG OUT/////////////////////////
app.post("/registration", async (req, res) => {
    try {
        let hash = await db.hashPassword(req.body.password);
        let result = await db.createUser(
            req.body.first,
            req.body.last,
            req.body.email,
            hash);
        req.session.userID = result.rows[0].id;
        res.json(req.session.userID);
    } catch(err) {
        console.log("ERROR IN REGISTRATION: ", err);
        res.json({error: true});
    }
});

app.post("/login", async (req, res) => {
    try {
        let resp = await db.getUserByMail(req.body.email);
        let match = await db.comparePassword(req.body.password, resp.rows[0].pass);
        if (match == true) {
            req.session.userID = resp.rows[0].id;
            res.json(req.session.userID);
        }

    } catch(err) {
        console.log("ERROR IN REGISTRATION: ", err);
        res.json({error: true});
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

///////////////////////////////////////////////////////////////////////

//////////////////GETTING INFORMATION ABOUT THE LOGGED IN USER////////////////
app.get("/user/info", async (req,res) => {
    //on the page load axios requests user information. here we ask DB and send it back to the front
    try {
        let resp = await db.getUserByID(req.session.userID);
        res.json({
            userID: req.session.userID,
            ProfilePicUrl: resp.rows[0].imgurl,
            first: resp.rows[0].first,
            last: resp.rows[0].last,
            bio: resp.rows[0].bio
        });
    } catch(err) {
        console.log("ERROR IN GETTING USER BY ID: ", err);
    }
});

////////////////GETTING INFORMATION ABOUT OTHER USER///////////////
app.get("/user/:id/info", async (req,res) => {
    try {
        //if the user tries to go to their own page
        if (req.params.id == req.session.userID) {
            res.json({
                error: true
            });
        }
        //if the provided route is not a number
        if (isNaN(req.params.id)) {
            res.json({
                error: true
            });
        }

        let resp = await db.getUserByID(req.params.id);
        res.json({
            userID: req.params.id,
            ProfilePicUrl: resp.rows[0].imgurl,
            first: resp.rows[0].first,
            last: resp.rows[0].last,
            bio: resp.rows[0].bio
        });
    } catch(err) {
        console.log("ERROR IN GETTING OPP BY ID: ", err);
        //if there is nothing in the db corresponding to the provided number
        res.json({
            error: true
        });
    }
});

////////////////////////UPLOAD PROFILE PICTURE//////////////////////
app.post("/upload", uploader.single("file"), s3.uploadToAmazon, async (req,res) => {
    if (req.file) {
        try {
            let data = await db.updatePic(req.session.userID, config.s3Url + req.file.filename);
            res.json(data.rows[0]);
        } catch(err) {
            console.log("ERROR IN UPLOAD: ", err);
        }
    } else {
        res.json({
            success: false
        });
    }
});

////////////////////UPDATE BIO////////////////////////
app.post("/update-bio", async (req,res) => {
    try {
        let resp = await db.updateBio(req.session.userID, req.body.bio);
        res.json({
            userID: req.session.userID,
            bio: resp.rows[0].bio
        });
    } catch(err) {
        console.log("ERROR IN UPDATING BIO: ", err);
    }
});

//////////////////////////FRIENDSHIPS/////////////////////////////
//////////CHECKING THE STATUS
app.get("/friendship/:id", async (req, res) => {
    try {
        let resp = await db.checkFriendship(req.session.userID, req.params.id);
        res.json(resp.rows[0]);
    } catch(err) {
        console.log("ERROR IN UPDATING BIO: ", err);
    }

});

//////SENDING A REQUEST
app.post("/friendship/:id/send", async (req, res) => {
    let resp = await db.sendRequest(req.session.userID, req.params.id);
    res.json(resp.rows[0]);
});

///UNFRIENDING OR CANCELLING REQUEST
app.post("/friendship/:id/delete", async (req, res) => {
    await db.cancelRequest(req.session.userID, req.params.id);
    res.json({great: true});
});

////ACCEPTING REQUEST
app.post("/friendship/:id/accept", async (req, res) => {
    let resp = await db.acceptRequest(req.params.id, req.session.userID);
    console.log("response on the back accepting the request!!!", resp);
    res.json(resp.rows[0]);
});

/////////////////////////GET ALL FRIENDS AND FRIEND REQUESTS/////////////////
app.get("/get-friends", async (req,res) => {
    let resp = await db.getFriendsAndWannabes(req.session.userID);
    res.json(resp.rows);
});

/////////////GETTING SEARCH RESULTS/////////////////////
app.get("/search/:request", async (req,res) => {
    console.log("search hit!");
    let resp = await db.search(req.params.request);
    console.log("search results", resp.rows);
    res.json(resp.rows);
});

/////////////////////////////////
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


//we are now replacing it with the big wrapper server
//otherwise there will be a lot of csurf errors
server.listen(8080, function() {
    console.log("Big brother is listening.");
});


////////////////////////////SOCKET/////////////////////////////////////////

//every key-value-pair is one online user (socketid:userid)
let onlineUsers = {};
//whenever this runs a new person has just connected
//io represents our server-side socket
//the returned object (socket) represents the connection that just happened
io.on("connection", async (socket) => {
    let socketID = socket.id;
    let userID = socket.request.session.userID;

    ////////////////////////for online users////////////////////////////////////////
    //add the currently connected user to our object of online users
    onlineUsers[socketID] = userID;
    //after adding new user to the onlineUsers object we create an array with just all user ids who are currently online
    let arrayOfIDs = Object.values(onlineUsers);

    try {
        //first we send a list of online users to ourselves (including ourselves)
        let results = await db.getUsersByIds(arrayOfIDs);
        socket.emit("onlineUsers", results.rows);

        /////now we need to inform everyone except person who just connected that there is a new online user////////
        let resp = await db.getUserByID(userID);
        //checking if this user is already in the array and maybe just opened a new tab
        //they should be in array exactly once because they have just logged in in the single tab
        if (arrayOfIDs.filter(
            id => id == userID
        ).length == 1) {
            socket.broadcast.emit("userJoined", resp.rows[0]);
        }
        /////////////////////end of online users///////////////////////////////

        ///////////////////////////////messages/////////////////////////////////////////
        //on connect we are getting 10 last messages and emit them into the state to the front
        let messages = await db.getTenMessages();
        io.sockets.emit("showLastMessages", messages.rows);
    } catch(err) {
        console.log("error in online users/10 messages socket", err);
    }

    //this happens whenever the user disconnects ie closes tab, logs out etc
    socket.on("disconnect", async function() {
        try {
            //deleting the user first from the object with online users and then resetting the array of user ids
            delete onlineUsers[socketID];
            arrayOfIDs = Object.values(onlineUsers);
            //if after deleting the user this user no longer exists in the array (i.e. no more open tabs then we emit the event)
            if (arrayOfIDs.filter(
                id => id == userID
            ).length == 0) {
                io.sockets.emit('userLeft', userID);
            }
        } catch(err) {
            console.log("error in disconnecting socket", err);
        }
    });
    /////////////////////chat////////////////////////////
    //when the front sends a chat message we insert it into db and send it back to the front and it gets added to the array of shown messages
    socket.on("chatMessage", async msg => {
        await db.insertChatMessage(userID, msg);
        let resp = await db.getTheInsertedMessageBack();
        io.sockets.emit("addMessage", resp.rows);
    });

    ///////////////////user makes a friend request///////////////////
    socket.on("friendRequestMade", async id => {
        //getting information about the active user to send it to the user who is being befirended
        let resp = await db.getUserByID(userID);

        //getting the socket id of the person to send it to based on their user id
        let receiver_id = Object.keys(onlineUsers).find(key => onlineUsers[key] == id);

        if (receiver_id != undefined) {
            socket.broadcast.to(receiver_id).emit('friendRequest', resp.rows);
        } else {
            console.log("something doesnt work in friend request notification");
        }
    });
});

///////////////////////CUSTOM MIDDLEWARE TO FASCILITATE SYNTAX////////////////////////
function needNoUserID(req, res, next) {
    if (req.session.userID) {
        res.redirect("/");
    } else {
        next();
    }
}

function needUserID(req, res, next) {
    if (!req.session.userID) {
        res.redirect("/welcome");
    } else {
        next();
    }
}
