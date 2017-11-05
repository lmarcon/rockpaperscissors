/**
 * A set of helpers to build common DOM elements
 */

/**
 * Helper to build buttons
 * @param className
 * @param label
 * @param onClick
 * @returns {Element}
 */
export function buttonFactory(className, label, onClick) {
	let btn = document.createElement('button');
	btn.className = `button button__${className}`;

	if (label) {
		btn.innerHTML = label;
	}

	if (typeof onClick === 'function') {
		btn.className += ' clickable';
		btn.addEventListener('click', onClick);
	}

	return btn;
}

/**
 * Helper to build divs
 * @param className
 * @returns {Element}
 */
export function divFactory(className) {
	let div = document.createElement('div');
	div.className = className;

	return div;
}

/**
 * Helper to build two sided panels
 * @param name
 * @returns {Element}
 */
export function splitFactory(name) {
	let split = divFactory(name);
	let splitP1 = divFactory(`${name}__p1`);
	let splitP2 = divFactory(`${name}__p2`);

	split.appendChild(splitP1);
	split.appendChild(splitP2);

	split.p1 = splitP1;
	split.p2 = splitP2;

	return split;
}

/**
 * Helper to build messages
 * @param msg
 * @returns {Element}
 */
export function messageFactory(msg) {
	let message = document.createElement('p');
	message.className = `message__body`;
	message.innerHTML = msg;

	return message;
}

/**
 * Helper to build a list of elements
 * @param list
 * @returns {Element}
 */
export function listFactory(list) {
	let ul = document.createElement('ul');

	list.forEach(l => {
		let li = document.createElement('li');
		li.innerHTML = l;
		ul.appendChild(li);
	});

	return ul;
}
