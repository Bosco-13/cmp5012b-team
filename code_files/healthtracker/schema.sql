DROP TABLE IF EXISTS heartrate CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS dashboard CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sleep CASCADE;

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
    dietary_preference VARCHAR(50),
    target_sleep_hour INTEGER CHECK (target_sleep_hour BETWEEN 0 AND 23)
    target_sleep_minitues INTEGER CHECK (target_sleep_minitues BETWEEN 0 AND 59)
);

CREATE TABLE dashboard (
    dashboard_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    page_name VARCHAR(50) NOT NULL
);

CREATE TABLE dishes (
    dish_id INTEGER,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_logged DATE
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE dishinfo (
    dish_id INTEGER,
    food_title VARCHAR(100),
    food_image VARCHAR(150),
    calories INTEGER CHECK (calories > 0),
    fat INTEGER CHECK (fat > 0),
    protein INTEGER CHECK (protein > 0),
    receipe VARCHAR(1000),
    ingridient VARCHAR(1000)
)

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

CREATE TABLE sleep (
    sleep_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
);
