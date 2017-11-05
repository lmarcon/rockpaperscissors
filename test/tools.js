/**
 * Super simple hand-made spy maker for testing purposes
 */
export class Spy {
	constructor(obj, fn, cb) {
		this.original = obj[fn];
		this.obj = obj;
		this.fn = fn;
		obj[fn] = () => { this.callCount++; if (typeof cb === 'function') { return cb(); } };
		this.callCount = 0;
	}

	restore() {
		this.obj[this.fn] = this.original;
	}
}
