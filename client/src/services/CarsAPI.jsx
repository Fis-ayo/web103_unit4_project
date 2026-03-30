const getAllOptions = async () => {
    try {
        const response = await fetch(`http://localhost:3001/api/options`);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}
const getAllCars = async () => {
    try{
        const response = await fetch('http://localhost:3001/api/cars');
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

const getCarById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/api/cars/${id}`);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

const createCar = async (data) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        const response = await fetch('http://localhost:3001/api/cars', options);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

const updateCar = async (id, data) => {
    try{
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(`http://localhost:3001/api/cars/${id}`, options);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

const deleteCar = async (id) => {
    try {
        const options = {
            method: 'DELETE'
        }
        const response = await fetch(`http://localhost:3001/api/cars/${id}`, options);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
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