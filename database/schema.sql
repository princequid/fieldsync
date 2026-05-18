-- Schema placeholder
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);
CREATE TABLE fields (id SERIAL PRIMARY KEY, name TEXT, location TEXT);
CREATE TABLE reports (id SERIAL PRIMARY KEY, field_id INTEGER, reporter_id INTEGER, notes TEXT);
