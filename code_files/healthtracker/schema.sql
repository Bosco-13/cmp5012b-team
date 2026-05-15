CREATE SCHEMA healthsystem;
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
    target_sleep_hour INTEGER CHECK (target_sleep_hour BETWEEN 0 AND 23),
    target_sleep_minitues INTEGER CHECK (target_sleep_minitues BETWEEN 0 AND 59),
    sleep_streak INTEGER DEFAULT 0,
    theme VARCHAR(10) DEFAULT 'light',
    units VARCHAR(10) DEFAULT 'metric'
);

CREATE TABLE dashboard (
    dashboard_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    page_name VARCHAR(50) NOT NULL
);

CREATE TABLE dishinfo (
    dish_id INTEGER PRIMARY KEY,
    food_title VARCHAR(100),
    meal_type VARCHAR(150) 
    CHECK(meal_type IN ('main-course', 'side-dish', 'salad')),
    diet VARCHAR(150)
    CHECK(diet IN ('vegan', 'vegetarian', 'pescetarian', 'none')),
    calories INTEGER CHECK (calories > 0),
    carbs INTEGER CHECK (carbs > 0),
    fat INTEGER CHECK (fat > 0),
    protein INTEGER CHECK (protein > 0),
    receipe VARCHAR(1000),
    ingridient VARCHAR(1000)
);

CREATE TABLE dishes (
    record_id SERIAL  PRIMARY KEY,
    dish_id INTEGER REFERENCES dishinfo(dish_id),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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

CREATE TABLE sleep (
    sleep_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE workouts (
    workout_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_name VARCHAR(100) NOT NULL,
    duration_hours NUMERIC(4,2) NOT NULL CHECK (duration_hours > 0),
    workout_date DATE NOT NULL
);

CREATE TABLE workout_exercises (
    exercise_id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_name VARCHAR(100) NOT NULL,
    sets INTEGER NOT NULL CHECK (sets > 0),
    reps INTEGER NOT NULL CHECK (reps > 0)
);

CREATE TABLE healthsystem.goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES healthsystem.users(id) ON DELETE CASCADE,
    goal_category VARCHAR(50) NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value INTEGER NOT NULL CHECK (target_value > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, goal_type)
);

-- These lines are needed for dark mode to be used in settings page, do not run again unless dark mode is not working!

-- ALTER TABLE healthsystem.profiles
-- ADD COLUMN theme VARCHAR(10) DEFAULT 'light';

-- ALTER TABLE healthsystem.profiles
-- ADD COLUMN units VARCHAR(10) DEFAULT 'metric';

ALTER TABLE healthsystem.users
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expiry BIGINT;



