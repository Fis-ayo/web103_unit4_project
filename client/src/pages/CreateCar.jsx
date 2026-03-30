import React from 'react'
import Category from '../components/Category'
import CarsAPI from '../services/CarsAPI'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateTotalPrice } from '../utilities/priceCalculation'
import '../css/CreateCar.css'
import '../App.css'

const BASE_CAR_PRICE = 50000;
const CONVERTIBLE_SURCHARGE = 10000;

const getBasePrice = (isConvertible) => {
    return isConvertible ? BASE_CAR_PRICE + CONVERTIBLE_SURCHARGE : BASE_CAR_PRICE;
}

const isRoofCompatibleWithConvertibleState = (roofOption, convertibleState) => {
    if (!roofOption) return true;

    const compatibleFlag = roofOption.convertiblecompatible ?? roofOption.convertibleCompatible;
    const isConvertibleOnlyRoof = Boolean(compatibleFlag);

    return convertibleState ? isConvertibleOnlyRoof : !isConvertibleOnlyRoof;
}

const CreateCar = () => {
    const navigate = useNavigate();
    const [carName, setCarName] = useState('');
    const [exteriorId, setExteriorId] = useState(null);
    const [roofId, setRoofId] = useState(null);
    const [wheelsId, setWheelsId] = useState(null);
    const [interiorId, setInteriorId] = useState(null);
    const [selectedOptionPrices, setSelectedOptionPrices] = useState({
        exterior: 0,
        roof: 0,
        wheels: 0,
        interior: 0
    });
    const [selectedOptions, setSelectedOptions] = useState({
        exterior: null,
        roof: null,
        wheels: null,
        interior: null
    });
    const [isConvertible, setIsConvertible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(BASE_CAR_PRICE);

    const handleOptionSelected = (category, option) => {
        if (!option) return;

        setSelectedOptions((previousOptions) => ({
            ...previousOptions,
            [category]: option
        }));

        setSelectedOptionPrices((previousPrices) => {
            const nextPrices = {
                ...previousPrices,
                [category]: option.price
            };

            setTotalPrice(calculateTotalPrice(getBasePrice(isConvertible), nextPrices));
            return nextPrices;
        });
    }

    const handleConvertibleChange = (event) => {
        const nextConvertibleState = event.target.checked;
        setIsConvertible(nextConvertibleState);

        const roofOption = selectedOptions.roof;
        const roofCompatible = isRoofCompatibleWithConvertibleState(roofOption, nextConvertibleState);

        if (roofCompatible) {
            setTotalPrice(calculateTotalPrice(getBasePrice(nextConvertibleState), selectedOptionPrices));
            return;
        }

        setRoofId(null);
        setSelectedOptions((previousOptions) => ({ ...previousOptions, roof: null }));
        setSelectedOptionPrices((previousPrices) => {
            const nextPrices = { ...previousPrices, roof: 0 };
            setTotalPrice(calculateTotalPrice(getBasePrice(nextConvertibleState), nextPrices));
            return nextPrices;
        });
        alert('Your previous roof selection is incompatible with the selected convertible mode. Please choose a compatible roof option.');
    }

    const createCar = async () => {
        try {
            const data = {
                name: carName,
                exterior_id: exteriorId,
                roof_id: roofId,
                wheels_id: wheelsId,
                interior_id: interiorId,
                totalPrice: totalPrice,
                isConvertible: isConvertible
            }
            const result = await CarsAPI.createCar(data);
            console.log(result);
            navigate('/customcars');
        } catch (err) {
            console.error(err);
            alert('Failed to create car. Please review your selected options and try again.');
        }
    }

    return (
        <div>
            <header className='create-car'>
                <div className='creater-car-first'>
                    <label>
                        <input type='checkbox' id='isConvertible' checked={isConvertible} onChange={handleConvertibleChange}></input>
                        Convertible
                    </label>
                    <Category
                        isConvertible={isConvertible}
                        setExteriorId={setExteriorId}
                        setRoofId={setRoofId}
                        setWheelsId={setWheelsId}
                        setInteriorId={setInteriorId}
                        onOptionSelected={handleOptionSelected}
                        onIncompatibleOption={() => alert('This roof option is not compatible with the current convertible setting.')}
                    />
                </div>
                <div className='create-car-name'>
                    <input type='text' id='name' name='name' placeholder='My New Car' onChange={(e) => setCarName(e.target.value)}></input>
                    <input type='button' className='create-car-button' value='Create' onClick={() => createCar()}></input>
                </div>
            </header>
            <div className='create-car-price'>💰 ${totalPrice}</div>
        </div>
    )
}

export default CreateCar