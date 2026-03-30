import React from 'react'
import { useState, useEffect } from 'react'
import CarsAPI from '../services/CarsAPI';
import '../css/ViewCar.css'
import '../App.css'

const ViewCars = () => {
    const [cars, setCars] = useState([]);

    const handleCarDelete = async (carId) => {
        try {
            await CarsAPI.deleteCar(carId);
            setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
            alert('Car deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete car. Please try again.');
        }
    }

    useEffect(() => {
        const fetchCars = async() => {
            try {
                const result = await CarsAPI.getAllCars();
                setCars(result);
            } catch (err) {
                console.error(err);
            }
        }
        fetchCars();
    }, []);
    
    return (
            <main className='view-cars'>
                {cars.map((car) => (
                    <article key={car.id}>
                        <header className='car-card-header'>
                            <h3>{car.name}</h3>
                            <div className='car-card-header-btns'>
                                <a href={`/edit/${car.id}`} role="button">Edit</a>
                                <button onClick={() => handleCarDelete(car.id)}>Delete</button>
                            </div>
                        </header>
                        <div className='car-card'>
                            <div className='car-summary'>
                                <p>Exterior: {car.exterior_name}</p>
                                <p>Roof: {car.roof_name}</p>
                            </div>
                            <div className='car-summary'>
                                <p>Wheels: {car.wheels_name}</p>
                                <p>Interior: {car.interior_name}</p>
                            </div>
                            <div className='car-price'>
                                <p>💰 ${car.totalprice}</p>
                                <a href={`/customcars/${car.id}`} role='button'>DETAILS</a>
                            </div>
                        </div>
                    </article>
                ))}
            </main>
    )
}

export default ViewCars