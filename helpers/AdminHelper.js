const mysql = require('mysql2/promise'); // Use promise-based version
const {pool}=require('../database')

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
async function addTrain(trainData) {
    const { train_name, train_no, destination, fc, sc, tc, slc } = trainData;

    // Create the trains table if it does not exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS trains (
            id INT AUTO_INCREMENT PRIMARY KEY,
            train_name VARCHAR(255) NOT NULL,
            train_no VARCHAR(50) NOT NULL UNIQUE,
            destination VARCHAR(255) NOT NULL,
            first_class_seats INT NOT NULL,
            second_class_seats INT NOT NULL,
            third_class_seats INT NOT NULL,
            sleeper_class_seats INT NOT NULL
        )
    `);

    // Insert the new train data into the trains table
    const [result] = await pool.query(`
        INSERT INTO trains (train_name, train_no, destination, first_class_seats, second_class_seats, third_class_seats, sleeper_class_seats)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [train_name, train_no, destination, parseInt(fc, 10), parseInt(sc, 10), parseInt(tc, 10), parseInt(slc, 10)]);

    console.log('Train added:', result); // Log the result
    return result; // Return the result of the insert operation
}
async function getAllStations() {
    try {
        // Query to select all stations from the stations table
        const [stations] = await pool.query(`
            SELECT * FROM stations
        `);

        console.log('All stations:', stations); // Log the result
        return stations; // Return the list of all stations
    } catch (error) {
        console.error('Error fetching stations:', error);
        throw error; // Propagate the error for further handling
    }
}
async function getAllTrains() {
    try {
        // Query to select all trains from the trains table
        const [trains] = await pool.query(`
            SELECT * FROM trains
        `);

        console.log('All trains:', trains); // Log the result
        return trains; // Return the list of all trains
    } catch (error) {
        console.error('Error fetching trains:', error);
        throw error; // Propagate the error for further handling
    }
}


module.exports={
    addStation,
    addTrain,
    getAllStations,
    getAllTrains,
    

}
