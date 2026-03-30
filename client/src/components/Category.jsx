import {useState, useEffect} from 'react'
import CarsAPI from '../services/CarsAPI';
import '../App.css'
import '../css/Category.css'

const Category = (props) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [clickedId, setClickedId] = useState(0);
    const [exterior, setExterior] = useState([]);
    const [roof, setRoof] = useState([]);
    const [wheels, setWheels] = useState([]);
    const [interior, setInterior] = useState([]);

    useEffect(() => {
        const fetchOptions = async() => {
            try{
                const result = await CarsAPI.getAllOptions();
                setOptions(result);
            } catch (err) {
                console.error(err);
            }
        }

        fetchOptions();
    }, []);

    const handleExterior = () => {
        const exteriorOptions = options.filter((option) => option.category === 'exterior');
        setExterior(exteriorOptions);
    }
    const handleRoof = () => {
        const roofOptions = options.filter((option) => option.category === 'roof');
        setRoof(roofOptions);
    }
    const handleWheels = () => {
        const wheelsOptions = options.filter((option) => option.category === 'wheels');
        setWheels(wheelsOptions);
    }
    const handleInterior = () => {
        const interiorOptions = options.filter((option) => option.category === 'interior');
        setInterior(interiorOptions);
    }

    const handleDone = () => {
        const setterByCategory = {
            exterior: props.setExteriorId,
            roof: props.setRoofId,
            wheels: props.setWheelsId,
            interior: props.setInteriorId
        };

        const selectedSetter = setterByCategory[selectedOption];
        const selectedOptionData = options.find((option) => option.id === clickedId);
        if (typeof selectedSetter === 'function' && clickedId !== 0) {
            selectedSetter(clickedId);
        }

        if (typeof props.onOptionSelected === 'function' && selectedOptionData) {
            props.onOptionSelected(selectedOption, selectedOptionData);
        }

        setSelectedOption(null);
        setClickedId(0);
    }

    const isRoofOptionCompatible = (option) => {
        const compatibleFlag = option.convertiblecompatible ?? option.convertibleCompatible;
        const isConvertibleOnlyRoof = Boolean(compatibleFlag);

        if (props.isConvertible) {
            return isConvertibleOnlyRoof;
        }

        return !isConvertibleOnlyRoof;
    }

    const handleOptionClick = (option) => {
        if (selectedOption === 'roof' && !isRoofOptionCompatible(option)) {
            if (typeof props.onIncompatibleOption === 'function') {
                props.onIncompatibleOption(option);
            } else {
                alert('That roof is not compatible with a convertible setup. Please select a compatible roof option.');
            }
            return;
        }

        setClickedId(option.id);
    }

    const handleSelected = (option) => {
        setSelectedOption(option);
        setClickedId(0);
        switch(option) {
            case 'exterior':
                handleExterior();
                break;
            case 'roof':
                handleRoof();
                break;
            case 'wheels':
                handleWheels();
                break;
            case 'interior':
                handleInterior();
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <div className='create-car-options'>
            <div className='car-options'>
                <button onClick={() => handleSelected('exterior')}>EXTERIOR</button>
                <button onClick={() => handleSelected('roof')}>ROOF</button>
                <button onClick={() => handleSelected('wheels')}>WHEELS</button>
                <button onClick={() => handleSelected('interior')}>INTERIOR</button>
            </div>
            </div>
            {selectedOption === 'exterior' && (
                <div className='option-category'>
                    <div className='available-options'>
                        {exterior.map((option) => (
                            <div className='option-card' key={option.id} 
                            onClick={() => handleOptionClick(option)}
                            style={{ backgroundImage: `url(${option.imageurl})`, border: option.id === clickedId ? '3px solid green' : 'none' }}>
                                <div className='option-overlay'>
                                    <div className='option-card-details'>
                                        <p>{option.name} <br />${option.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleDone()}>DONE</button>
                </div>
            )}
            {selectedOption === 'roof' && (
                <div className='option-category'>
                    <div className='available-options'>
                        {roof.map((option) => {
                            const isCompatible = isRoofOptionCompatible(option);
                            const incompatibleLabel = props.isConvertible
                                ? 'Convertible mode requires convertible-compatible roofs.'
                                : 'This roof is convertible-only.';

                            return (
                            <div
                                className='option-card'
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                                style={{
                                    backgroundImage: `url(${option.imageurl})`,
                                    border: option.id === clickedId ? '3px solid green' : 'none',
                                    opacity: isCompatible ? 1 : 0.4,
                                    cursor: isCompatible ? 'pointer' : 'not-allowed'
                                }}
                                title={isCompatible ? '' : incompatibleLabel}
                            >
                                <div className='option-overlay'>
                                    <div className='option-card-details'>
                                        <p>{option.name} <br />${option.price}</p>
                                        {!isCompatible && <p>Not Compatible</p>}
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    <button onClick={() => handleDone()}>DONE</button>
                </div>
            )}
            {selectedOption === 'wheels' && (
                <div className='option-category'>
                    <div className='available-options'>
                        {wheels.map((option) => (
                            <div className='option-card' key={option.id} onClick={() => handleOptionClick(option)}
                            style={{ backgroundImage: `url(${option.imageurl})`, border: option.id === clickedId ? '3px solid green' : 'none' }}>
                                <div className='option-overlay'>
                                    <div className='option-card-details'>
                                        <p>{option.name} <br />${option.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleDone()}>DONE</button>
                </div>
            )}
            {selectedOption === 'interior' && (
                <div className='option-category'>
                    <div className='available-options'>
                        {interior.map((option) => (
                            <div className='option-card' key={option.id} onClick={() => handleOptionClick(option)}
                            style={{ backgroundImage: `url(${option.imageurl})`, border: option.id === clickedId ? '3px solid green' : 'none' }}>
                                <div className='option-overlay'>
                                    <div className='option-card-details'>
                                        <p>{option.name} <br />${option.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleDone()}>DONE</button>
                </div>
            )}
        </div>
    )

}

export default Category;