import { pool } from '../config/database.js';

const getAllCars = async (req, res) => {
    try {
        const cars = await pool.query(`SELECT * FROM customItem ORDER BY id`);

        res.status(200).json(cars.rows);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const getCarById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const car = await pool.query(`SELECT FROM customItem WHERE id = $1`, [id]);
        
        if (car.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        } else {
            res.status(200).json(car.rows[0]);
        }
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const createCar = async (req, res) => {
    try {
        const { name, exterior_id, interior_id, wheels_id, roof_id, totalPrice } = req.body;

        const newCar = await pool.query(`
            INSERT INTO customItem (name, exterior_id, interior_id, wheels_id, roof_id, totalPrice)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`, 
            [name, exterior_id, interior_id, wheels_id, roof_id, totalPrice])
        
        res.status(201).json(newCar.rows[0]);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const updateCar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, exterior_id, interior_id, wheels_id, roof_id, totalPrice } = req.body;

        const updatedCar = await pool.query(`
            UPDATE customItem SET name = $1, exterior_id = $2, interior_id = $3, wheels_id = $4, roof_id = $5, totalPrice = $6
            WHERE id = $7`, 
            [name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, id]
        );
        res.status(200).json(updatedCar.rows[0]);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const deleteCar = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const deletedCar = await pool.query(`DELETE FROM customItem WHERE id = $1`, [id])
        res.status(200).json(deletedCar.rows[0]);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

export default {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
}