const mysql = require('mysql2/promise'); // Use promise-based version
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to create a new user
async function createUser(userData) {
    const { first_name, last_name, email, pw, pw_confirm } = userData;

    // Validate input data
    if (pw !== pw_confirm) {
        throw new Error("Passwords do not match");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pw, 10);

    // Create the users table if it does not exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            pw VARCHAR(255) NOT NULL
        )
    `);

    // Insert the new user data into the users table
    const [result] = await pool.query(`
        INSERT INTO users (first_name, last_name, email, pw)
        VALUES (?, ?, ?, ?)
    `, [first_name, last_name, email, hashedPassword]); // Use hashed password

    console.log('User created:', result); // Log the result
    return result; // Return the result of the insert operation
}

// Function to get all notes (if needed)
async function getNotes() {
    const [rows] = await pool.query("SELECT * FROM notes");
    return rows;
}

// Function to get a single note by id (if needed)
async function getNote(id) {
    const [rows] = await pool.query(`SELECT * FROM notes WHERE id = ?`, [id]);
    return rows[0]; // Return the first result
}

// Example usage: Fetch and log all notes (if needed)
async function main() {
    const notes = await getNotes();
    // console.log(notes);
}
async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows; // Return all user records
}
async function loginUser(loginData) {
    const { email, pw } = loginData;

    // Fetch the user from the database by email
    const [rows] = await pool.query(`
        SELECT * FROM users WHERE email = ?
    `, [email]);

    // Check if the user exists
    if (rows.length === 0) {
        throw new Error("User not found");
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(pw, user.pw);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    console.log('User logged in:', user); // Log the user data
    return user; // Return the user data if login is successful
}


async function addStation(stationData) {
    const { station, location, platform, train } = stationData;

    // Create the stations table if it does not exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS stations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            station VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            platform VARCHAR(255) NOT NULL,
            train VARCHAR(255) NOT NULL
        )
    `);

    // Insert the new station data into the stations table
    const [result] = await pool.query(`
        INSERT INTO stations (station, location, platform, train)
        VALUES (?, ?, ?, ?)
    `, [station, location, platform, train]);

    console.log('Station added:', result); // Log the result
    return result; // Return the result of the insert operation
}





main().catch(err => console.error(err)); // Call main and handle potential errors

module.exports = {
    pool,
    createUser,
    getNotes,
    getNote,
    getUsers,
    loginUser,
    addStation
};
