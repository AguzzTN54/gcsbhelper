export const arcadeDate = {
	start: new Date('15 July 2024, 18:30 GMT+7'),
	end: new Date('23 September 2024, 01:29 GMT+7')
};

const timeOffset = new Date().getTimezoneOffset() / -60;
export const timeZone = `GMT${timeOffset > 0 ? '+' : ''}${timeOffset}`;

export const formatTime = (time) => {
	const localeDate = new Date(time).toLocaleString();
	const myDate = new Date(localeDate);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const date = myDate.getDate();
	const hour = myDate.getHours();
	const minute = myDate.getMinutes();
	const month = months[myDate.getMonth()];
	const year = myDate.getFullYear();
	const formated = `${date} ${month} ${year}, ${hour}:${minute}`;
	return formated;
};
