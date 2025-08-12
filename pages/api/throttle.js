export function throttle(func, wait) {
	let timeout;
	return function(...args) {
		if (!timeout) {
			timeout = setTimeout(() => {
				timeout = null;
				func.apply(this, args);
			}, wait);
		}
	};
}