DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
