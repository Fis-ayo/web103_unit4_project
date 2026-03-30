import React from 'react'
import CarsAPI from '../services/CarsAPI'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Category from '../components/Category'
import { calculateTotalPrice, toNumber } from '../utilities/priceCalculation'
import '../css/EditCar.css'
import '../App.css'

const BASE_CAR_PRICE = 50000;
const CONVERTIBLE_SURCHARGE = 10000;

const getBasePrice = (isConvertible) => {
    return isConvertible ? BASE_CAR_PRICE + CONVERTIBLE_SURCHARGE : BASE_CAR_PRICE;
}

const isRoofCompatibleWithConvertibleState = (roofCompatibleFlag, convertibleState) => {
    const isConvertibleOnlyRoof = Boolean(roofCompatibleFlag);
    return convertibleState ? isConvertibleOnlyRoof : !isConvertibleOnlyRoof;
}


const EditCar = () => {
    const [car, setCar] = useState(null);
    const [basePrice, setBasePrice] = useState(0);
    const [isConvertible, setIsConvertible] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const result = await CarsAPI.getCarById(id);
                const fetchedConvertibleState = Boolean(result.is_convertible ?? result.isconvertible);
                const computedBasePrice = getBasePrice(fetchedConvertibleState);
                setBasePrice(computedBasePrice);
                setIsConvertible(fetchedConvertibleState);

                const computedTotalPrice = calculateTotalPrice(computedBasePrice, {
                    exterior: result.exterior_price,
                    roof: result.roof_price,
                    wheels: result.wheels_price,
                    interior: result.interior_price
                });

                setCar({
                    ...result,
                    totalprice: computedTotalPrice
                });
            } catch (err) {
                console.error(err);
            }
        }
        fetchCar();
    }, [id])

    const handleOptionSelected = (category, option) => {
        if (!option) return;

        setCar((prevCar) => {
            if (!prevCar) return prevCar;

            const nextCar = { ...prevCar };

            switch(category) {
                case 'exterior':
                    nextCar.exterior_id = option.id;
                    nextCar.exterior_name = option.name;
                    nextCar.exterior_price = option.price;
                    nextCar.exterior_image = option.imageurl;
                    break;
                case 'roof':
                    nextCar.roof_id = option.id;
                    nextCar.roof_name = option.name;
                    nextCar.roof_price = option.price;
                    nextCar.roof_image = option.imageurl;
                    nextCar.roof_convertible_compatible = option.convertiblecompatible ?? option.convertibleCompatible;
                    break;
                case 'wheels':
                    nextCar.wheels_id = option.id;
                    nextCar.wheels_name = option.name;
                    nextCar.wheels_price = option.price;
                    nextCar.wheels_image = option.imageurl;
                    break;
                case 'interior':
                    nextCar.interior_id = option.id;
                    nextCar.interior_name = option.name;
                    nextCar.interior_price = option.price;
                    nextCar.interior_image = option.imageurl;
                    break;
                default:
                    break;
            }

            nextCar.totalprice =
                calculateTotalPrice(basePrice, {
                    exterior: nextCar.exterior_price,
                    roof: nextCar.roof_price,
                    wheels: nextCar.wheels_price,
                    interior: nextCar.interior_price
                });

            return nextCar;
        });
    }

    const handleCarUpdate = async () => {
        if (!car) return;

        if (!car.roof_id) {
            alert('Please select a roof option before updating.');
            return;
        }

        try {
            const payload = {
                name: car.name,
                exterior_id: car.exterior_id,
                roof_id: car.roof_id,
                wheels_id: car.wheels_id,
                interior_id: car.interior_id,
                totalPrice: car.totalprice,
                isConvertible: isConvertible
            };

            await CarsAPI.updateCar(car.id, payload);
            alert('Car updated successfully!');
            navigate(`/customcars/${car.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update car. Please try again.');
        }
    }

    const handleConvertibleChange = (event) => {
        const nextConvertibleState = event.target.checked;
        setIsConvertible(nextConvertibleState);
        const nextBasePrice = getBasePrice(nextConvertibleState);
        setBasePrice(nextBasePrice);

        const roofCompatibleFlag = car?.roof_convertible_compatible ?? car?.roofconvertiblecompatible;
        const roofCompatible = isRoofCompatibleWithConvertibleState(roofCompatibleFlag, nextConvertibleState);

        setCar((prevCar) => {
            if (!prevCar) return prevCar;

            if (roofCompatible) {
                return {
                    ...prevCar,
                    totalprice: calculateTotalPrice(nextBasePrice, {
                        exterior: prevCar.exterior_price,
                        roof: prevCar.roof_price,
                        wheels: prevCar.wheels_price,
                        interior: prevCar.interior_price
                    })
                };
            }

            return {
                ...prevCar,
                roof_id: null,
                roof_name: 'Select a compatible roof',
                roof_price: 0,
                roof_image: '',
                roof_convertible_compatible: null,
                totalprice: calculateTotalPrice(nextBasePrice, {
                    exterior: prevCar.exterior_price,
                    roof: 0,
                    wheels: prevCar.wheels_price,
                    interior: prevCar.interior_price
                })
            };
        });

        if (!roofCompatible) {
            alert('Your current roof is incompatible with the selected convertible setting. Please choose a compatible roof option.');
        }
    }

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
                    <label>
                        <input type='checkbox' id='isConvertible' checked={isConvertible} onChange={handleConvertibleChange}></input>
                        Convertible
                    </label>
                    <Category
                        isConvertible={isConvertible}
                        setExteriorId={(optionId) => setCar((prevCar) => ({ ...prevCar, exterior_id: optionId }))}
                        setRoofId={(optionId) => setCar((prevCar) => ({ ...prevCar, roof_id: optionId }))}
                        setWheelsId={(optionId) => setCar((prevCar) => ({ ...prevCar, wheels_id: optionId }))}
                        setInteriorId={(optionId) => setCar((prevCar) => ({ ...prevCar, interior_id: optionId }))}
                        onOptionSelected={handleOptionSelected}
                        onIncompatibleOption={() => alert('This roof option is not compatible with the current convertible setting.')}
                    />
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
                        <button onClick={() => handleCarUpdate()} >Update</button>
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

export default EditCar