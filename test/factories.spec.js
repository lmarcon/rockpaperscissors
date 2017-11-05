import {buttonFactory, divFactory, splitFactory, messageFactory} from '../src/js/factories';
import {Spy} from './tools';

describe('Factory helpers', () => {
	it('should return a button', () => {
		let btn = buttonFactory('test');
		expect(btn.className).to.equal('button button__test');
		expect(btn.innerHTML).to.equal('');
	});

	it('should return a button with a label', () => {
		let btn = buttonFactory('test', 'my test button');
		expect(btn.innerHTML).to.equal('my test button');
	});

	it('should return a button with a callback on click', () => {
		let testObj = {};
		let spy = new Spy(testObj, 'fn');
		let btn = buttonFactory('test', 'my test button', testObj.fn);
		btn.click();
		expect(spy.callCount).to.equal(1);
	});

	it('should return a div', () => {
		let div = divFactory('test');
		expect(div.tagName).to.equal('DIV');
		expect(div.className).to.equal('test');
	});

	it('should return a splitted panel', () => {
		let split = splitFactory('test');
		expect(split.className).to.equal('test');
		expect(split.children.length).to.equal(2);
		expect(split.children[0].className).to.equal('test__p1');
		expect(split.children[1].className).to.equal('test__p2');
	});

	it('should return a message (<p>)', () => {
		let msg = messageFactory('test');
		expect(msg.className).to.equal('message__body');
		expect(msg.tagName).to.equal('P');
	});
});
