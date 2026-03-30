import {pool} from './database.js';
import options from '../data/carOptions.js';

const createTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS customItem;
        DROP TABLE IF EXISTS customOption;

        CREATE TABLE customOption (
            id SERIAL PRIMARY KEY,
            category VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            imageURL TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            convertibleCompatible BOOLEAN
        );

        CREATE TABLE customItem (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            exterior_id INT REFERENCES customOption(id) NOT NULL,
            interior_id INT REFERENCES customOption(id) NOT NULL,
            wheels_id INT REFERENCES customOption(id) NOT NULL,
            roof_id INT REFERENCES customOption(id) NOT NULL,
            totalPrice DECIMAL(10, 2) NOT NULL,
            isConvertible BOOLEAN NOT NULL DEFAULT FALSE
        );
    `

    await pool.query(createTableQuery);
    console.log('Tables created successfully');
}

const seedOptions = async () => {
    await Promise.all(options.map( async (option) => {
        await pool.query(`
            INSERT INTO customOption (category, name, imageURL, price, convertibleCompatible)
            VALUES ($1, $2, $3, $4, $5)
            `, [option.category, option.name, option.imageURL, option.price, option.convertibleCompatible]
        )   
    }));
    console.log('Options seeded successfully');
}

const resetDatabase = async() => {
    try {
        await createTable();
        await seedOptions();
    } catch(error) {
        console.error('Error resetting database:', error);
    }
}

resetDatabase();