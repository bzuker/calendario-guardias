/**
 * @param numOfSteps: Total number steps to get color, means total colors
 * @param step: The step number, means the order of the color
 */
export function rainbow(numOfSteps: number, step: number): string {
	// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	// Adam Cole, 2011-Sept-14
	// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	let r, g, b;
	const h = step / numOfSteps;
	const i = ~~(h * 6);
	const f = h * 6 - i;
	const q = 1 - f;
	switch (i % 6) {
		case 0:
			r = 1;
			g = f;
			b = 0;
			break;
		case 1:
			r = q;
			g = 1;
			b = 0;
			break;
		case 2:
			r = 0;
			g = 1;
			b = f;
			break;
		case 3:
			r = 0;
			g = q;
			b = 1;
			break;
		case 4:
			r = f;
			g = 0;
			b = 1;
			break;
		case 5:
			r = 1;
			g = 0;
			b = q;
			break;
	}
	const c =
		'#' +
		('00' + (~~(r * 255)).toString(16)).slice(-2) +
		('00' + (~~(g * 255)).toString(16)).slice(-2) +
		('00' + (~~(b * 255)).toString(16)).slice(-2);
	return c;
}

export function getUniqueColor(n) {
	const rgb = [0, 0, 0];

	for (let i = 0; i < 24; i++) {
		rgb[i % 3] <<= 1;
		rgb[i % 3] |= n & 0x01;
		n >>= 1;
	}

	return '#' + rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '');
}

export function selectColor(number) {
	const hue = number * 137.508; // use golden angle approximation
	return hslToHex(hue, 70, 70);
}

function hslToHex(h, s, l) {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0'); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}
