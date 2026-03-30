import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import '../css/CarDetails.css'
import '../App.css'

const CarDetails = () => {
    const [car, setCar] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const result = await CarsAPI.getCarById(id);
                setCar(result);
            } catch (err) {
                console.error(err);
            }
        }

        fetchCarDetails();
    }, [id]);

    const handleCarDelete = async (carId) => {
            try {
                await CarsAPI.deleteCar(carId);
                alert('Car deleted successfully!');
                navigate('/customcars');
            } catch (err) {
                console.error(err);
                alert('Failed to delete car. Please try again.');
            }
    }


    if (!car) return null;

    return (
        <div>
            <article className='car-full-details'>
                <header>
                    <h2>{car.name}</h2>
                </header>
                <div className='details-content'>
                    <div className='car-details-price'><p>💰 ${car.totalprice}</p></div>
                    <div className="car-selection" style={{ backgroundImage: `url(${car.exterior_image})`}}>
                        <div className="car-selection-overlay">
                            <div className="car-selection-details">
                                <p><strong>🖌️ Exterior:</strong> {car.exterior_name}</p>
                                <p className="option-price">💵 ${car.exterior_price}</p>
                            </div>
                        </div>
                    </div>
                    <div className="car-selection" style={{ backgroundImage: `url(${car.roof_image})`}}>
                        <div className="car-selection-overlay">
                            <div className="car-selection-details">
                                <p><strong>🏠 Roof:</strong> {car.roof_name}</p>
                                <p className="option-price">💵 ${car.roof_price}</p>
                            </div>
                        </div>
                    </div>
                    <div className="car-modify">
                        <a href={`/edit/${car.id}`} role="button">Edit</a>
                        <button onClick = {() => handleCarDelete(car.id)} >Delete</button>
                    </div>
                    <div className="car-selection" style={{ backgroundImage: `url(${car.wheels_image})`}}>
                        <div className="car-selection-overlay">
                            <div className="car-selection-details">
                                <p><strong>🛞 Wheels:</strong> {car.wheels_name}</p>
                                <p className="option-price">💵 ${car.wheels_price}</p>
                            </div>
                        </div>
                    </div>
                    <div className="car-selection" style={{ backgroundImage: `url(${car.interior_image})`}}>
                        <div className="car-selection-overlay">
                            <div className="car-selection-details">
                                <p><strong>🪑 Interior:</strong> {car.interior_name}</p>
                                <p className="option-price">💵 ${car.interior_price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default CarDetails