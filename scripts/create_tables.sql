CREATE TABLE SSHConnection (
    connection_id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    hostname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    user_id INT REFERENCES UserAccount(user_id), 
    credentials BYTEA NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- create table UserAccount(
--     user_id serial primary key,
--     email_address varchar(100) unique not null,
--     username varchar(50) unique not null,
--     password bytea not null,
--     created_at timestamptz default NOW()
-- );

-- create table SSHConnection(
--     connection_id serial primary key,
--     label varchar(255) not null,
--     hostname varchar(255) not null,
--     username varchar (255) not null,
--     user_id int references UserAccount(user_id), 
--     credentials bytea not null,
--     created_at timestamptz default NOW()
-- );

