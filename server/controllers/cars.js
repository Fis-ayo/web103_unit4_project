import { pool } from '../config/database.js';

const validateConvertibleRoofCompatibility = async (roofId, isConvertible) => {
    const roofOption = await pool.query(
        `SELECT id, name, convertiblecompatible FROM customOption WHERE id = $1 AND category = 'roof'`,
        [roofId]
    );

    if (roofOption.rows.length === 0) {
        return {
            isValid: false,
            statusCode: 400,
            message: 'Invalid roof option selected.'
        };
    }

    const isConvertibleOnlyRoof = Boolean(roofOption.rows[0].convertiblecompatible);

    if (isConvertible && !isConvertibleOnlyRoof) {
        return {
            isValid: false,
            statusCode: 400,
            message: `${roofOption.rows[0].name} is not compatible with convertible mode.`
        };
    }

    if (!isConvertible && isConvertibleOnlyRoof) {
        return {
            isValid: false,
            statusCode: 400,
            message: `${roofOption.rows[0].name} is a convertible-only roof and cannot be used for non-convertible builds.`
        };
    }

    return { isValid: true };
}

const getAllOptions = async(req, res) => {
    try{
        const options = await pool.query(`SELECT * FROM customOption`);
        res.status(200).json(options.rows);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}
const getAllCars = async (req, res) => {
    try {
        const cars = await pool.query(`
            SELECT
                ci.id, ci.name, ci.totalprice,
                ci.exterior_id, ci.roof_id, ci.wheels_id, ci.interior_id, ci.isconvertible,
                ext.name AS exterior_name, ext.imageurl AS exterior_image, ext.price AS exterior_price,
                roof.name AS roof_name, roof.imageurl AS roof_image, roof.price AS roof_price,
                whl.name AS wheels_name, whl.imageurl AS wheels_image, whl.price AS wheels_price,
                intr.name AS interior_name, intr.imageurl AS interior_image, intr.price AS interior_price
            FROM customItem ci
            JOIN customOption ext  ON ci.exterior_id = ext.id
            JOIN customOption roof ON ci.roof_id     = roof.id
            JOIN customOption whl  ON ci.wheels_id   = whl.id
            JOIN customOption intr ON ci.interior_id = intr.id
            ORDER BY ci.id
        `);
        res.status(200).json(cars.rows);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const getCarById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const car = await pool.query(`
            SELECT
                ci.id, ci.name, ci.totalprice,
                ci.exterior_id, ci.roof_id, ci.wheels_id, ci.interior_id, ci.isconvertible,
                ext.name AS exterior_name, ext.imageurl AS exterior_image, ext.price AS exterior_price,
                roof.name AS roof_name, roof.imageurl AS roof_image, roof.price AS roof_price, roof.convertiblecompatible AS roof_convertible_compatible,
                whl.name AS wheels_name, whl.imageurl AS wheels_image, whl.price AS wheels_price,
                intr.name AS interior_name, intr.imageurl AS interior_image, intr.price AS interior_price
            FROM customItem ci
            JOIN customOption ext  ON ci.exterior_id = ext.id
            JOIN customOption roof ON ci.roof_id     = roof.id
            JOIN customOption whl  ON ci.wheels_id   = whl.id
            JOIN customOption intr ON ci.interior_id = intr.id
            WHERE ci.id = $1
        `, [id]);
        
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
        const { name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, isConvertible } = req.body;

        const compatibilityCheck = await validateConvertibleRoofCompatibility(roof_id, Boolean(isConvertible));
        if (!compatibilityCheck.isValid) {
            return res.status(compatibilityCheck.statusCode).json({ error: compatibilityCheck.message });
        }

        const newCar = await pool.query(`
            INSERT INTO customItem (name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, isConvertible)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`, 
            [name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, Boolean(isConvertible)])
        
        res.status(201).json(newCar.rows[0]);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}

const updateCar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, isConvertible } = req.body;

        const compatibilityCheck = await validateConvertibleRoofCompatibility(roof_id, Boolean(isConvertible));
        if (!compatibilityCheck.isValid) {
            return res.status(compatibilityCheck.statusCode).json({ error: compatibilityCheck.message });
        }

        const updatedCar = await pool.query(`
            UPDATE customItem
            SET name = $1, exterior_id = $2, interior_id = $3, wheels_id = $4, roof_id = $5, totalPrice = $6, isConvertible = $7
            WHERE id = $8`, 
            [name, exterior_id, interior_id, wheels_id, roof_id, totalPrice, Boolean(isConvertible), id]
        );

        if (updatedCar.rowCount === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const refreshedCar = await pool.query(`
            SELECT
                ci.id, ci.name, ci.totalprice,
                ci.exterior_id, ci.roof_id, ci.wheels_id, ci.interior_id, ci.isconvertible,
                ext.name AS exterior_name, ext.imageurl AS exterior_image, ext.price AS exterior_price,
                roof.name AS roof_name, roof.imageurl AS roof_image, roof.price AS roof_price, roof.convertiblecompatible AS roof_convertible_compatible,
                whl.name AS wheels_name, whl.imageurl AS wheels_image, whl.price AS wheels_price,
                intr.name AS interior_name, intr.imageurl AS interior_image, intr.price AS interior_price
            FROM customItem ci
            JOIN customOption ext  ON ci.exterior_id = ext.id
            JOIN customOption roof ON ci.roof_id     = roof.id
            JOIN customOption whl  ON ci.wheels_id   = whl.id
            JOIN customOption intr ON ci.interior_id = intr.id
            WHERE ci.id = $1
        `, [id]);

        res.status(200).json(refreshedCar.rows[0]);
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
    getAllOptions,
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
}