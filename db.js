const spicedPg = require("spiced-pg");
const bcrypt = require("./bcrypt");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

/////////////////////////////////////////////////////////////////////
////////////////CREATING A USER AFTER THE REGISTRATION///////////////

exports.createUser = function createUser(first, last, email, pass) {
    return db.query(
        `INSERT INTO users (first, last, email, pass)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [first || null, last || null, email || null, pass || null]
    );
};

////////////////////GETTING A USER BY E-MAIL AFTER LOG IN/////////////////
//we are using this to compare passwords and let user in or not///////

exports.getUserByMail = function getUserByMail(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email=$1`, [email]
    );
};


//////////////GETTING A USER BY ID AFTER THE LOG IN//////////////////
//////this we use after the log in to display users information//////

exports.getUserByID = function getUserByID(userID) {
    return db.query (`
        SELECT id, first, last, imgurl, bio
        FROM users
        WHERE id=$1`, [userID]);
};


//////////////////////////UPDATING PROFILE PIC////////////////////

exports.updatePic = function updatePic(userID, ProfilePicUrl) {
    return db.query(`
        UPDATE users
        SET imgurl = $2
        WHERE id = $1
        RETURNING id, imgurl`, [userID, ProfilePicUrl]);
};

///////////////////////UPDATING YOUR BIO////////////////////////
exports.updateBio = function updateBio(userID, bioText) {
    return db.query(`
        UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING id, bio
        `, [userID, bioText]);
};

/////////////////////CHECK FRIENDSHIP////////////////////////
exports.checkFriendship = function checkFriendship(senderID, receiverID) {
    return db.query(`
        SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        `, [senderID, receiverID]);
};


/////////////////////SEND A FRIEND REQUEST////////////////////////

exports.sendRequest = function sendRequest(senderID, receiverID) {
    return db.query(`
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *`, [senderID, receiverID]);
};

//////////////////////////CANCEL REQUEST////////////////////////
exports.cancelRequest = function cancelRequest(senderID, receiverID) {
    return db.query(`
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        RETURNING *`, [senderID, receiverID]);
};


//////////////////////////ADDING A FRIEND/////////////////////////////
exports.acceptRequest = function acceptRequest(senderID, receiverID) {
    return db.query(`
        UPDATE friendships
        SET accepted=true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`, [senderID, receiverID]);
};


//////////////////////GETTING FRIENDS FOR MY FRIENDS AND WANNABEES PAGE/////////////
//we kinda select all the users.id which satisfy the condition
exports.getFriendsAndWannabes = function getFriendsAndWannabes(id) {
    return db.query(`
    SELECT users.id, first, last, imgurl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`, [id]);
};


/////////////////GETTING ONLINE FRIENDS///////////////////////////
/////////////////////////////////////////////////////////////////
exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    const query = `SELECT id, first, last, imgurl FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};


///////////////GETTING 10 MOST RECENT MESSAGES////////////////////
/////////////////////////////////////////////////////////////////
exports.getTenMessages = function getTenMessages() {
    return db.query(`
        SELECT * FROM (
            SELECT m.id as m_id, m.message, m.sender_id, m.created_at, u.first, u.last, u.imgurl, u.id as u_id
            FROM messages AS m
            LEFT JOIN users as u
            ON m.sender_id = u.id
            ORDER BY created_at DESC
            LIMIT 10
        ) as test
        ORDER BY test.created_at ASC
        `);
};

//////////////////////INSERTING THE NEW CHAT MESSAGE IN///////////////////////
exports.insertChatMessage = function insertChatMessage(sender_id, message) {
    return db.query(`
            INSERT INTO messages (sender_id, message)
            VALUES ($1, $2)`, [sender_id, message]);
};

/////////////////////////GETTING THE INSERTED MESSAGE BACK/////////////////////////
exports.getTheInsertedMessageBack = function getTheInsertedMessageBack() {
    return db.query(`
        SELECT m.id as m_id, m.message, m.sender_id, u.first, u.last, u.imgurl, u.id as u_id
        FROM messages AS m
        LEFT JOIN users as u
        ON m.sender_id = u.id
        ORDER BY created_at DESC
        LIMIT 1`);
};

////////////////////////////SEARCHING DATABASE FOR A SEARCH REQUEST/////////////////
exports.search = function search(request) {
    return db.query(`
        SELECT *
        FROM users
        WHERE first ILIKE  $1 OR last ILIKE  $1`, [request + "%"]);
};


/////////////////////HASHING PASSWORDS////////////////////////
/////////////////////////////////////////////////////////////
exports.hashPassword = function hashPassword(textPass) {
    return bcrypt.hash(textPass);
};

exports.comparePassword = function comparePassword(textPassword, hashPassword) {
    return bcrypt.compare(textPassword, hashPassword);
};
