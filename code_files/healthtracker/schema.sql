DROP TABLE IF EXISTS heartrate CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS calories CASCADE;
DROP TABLE IF EXISTS dashboard CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE SCHEMA IF NOT EXISTS healthsystem;

SET search_path TO healthsystem, public;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    real_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    gender VARCHAR(20),
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    fitness_goal VARCHAR(50),
    activity_level VARCHAR(20),
    target_weight NUMERIC(5,2),
    preferred_workout_type VARCHAR(50),
    dietary_preference VARCHAR(50)
);

CREATE TABLE dashboard (
    dashboard_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    page_name VARCHAR(50) NOT NULL
);

CREATE TABLE calories (
    calorie_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    food_item VARCHAR(100),
    calories INTEGER,
    date_logged DATE
);

CREATE TABLE activity (
    activity_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50),
    duration INTEGER,
    calories_burned INTEGER,
    date_logged DATE
);

CREATE TABLE heartrate (
    heartrate_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bpm INTEGER,
    date_recorded TIMESTAMP
);
