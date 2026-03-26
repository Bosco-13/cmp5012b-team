CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    real_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
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