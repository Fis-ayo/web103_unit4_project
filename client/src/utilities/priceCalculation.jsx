export const toNumber = (value) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

export const calculateTotalPrice = (basePrice = 0, optionPrices = {}) => {
	return Object.values(optionPrices).reduce((runningTotal, currentPrice) => {
		return runningTotal + toNumber(currentPrice);
	}, toNumber(basePrice));
}
