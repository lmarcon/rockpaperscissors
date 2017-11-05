import mockConfig from './config.mock';
import Game from '../src/js/Game';

describe('Game engine', () => {
	let game = null;

	before(() => {
		const mockMath = Object.create(global.Math);
		mockMath.random = () => 0.5;
		global.Math = mockMath;

		game = new Game(mockConfig);
	});

	it('should throw an exception in case of null undefined config or if there isn\'t at least 1 possible move', () => {
		expect(() => new Game(null)).to.throw('bad config');
		expect(() => new Game(undefined)).to.throw('bad config');
		expect(() => new Game('just_a_string')).to.throw('bad config');
		expect(() => new Game(1.23123)).to.throw('bad config');
		expect(() => new Game(false)).to.throw('bad config');
		expect(() => new Game({})).to.throw('bad config');
	});

	it('should load the config', () => {
		expect(game.config).to.deep.equal(mockConfig);
	});

	it('should return the possible moves for this game', () => {
		expect(game.getPossibleMoves()).to.deep.equal(Object.keys(mockConfig.moves));
	});

	it('should return 0 (tie) if two moves are the same', () => {
		expect(game.roundResult('move1', 'move1')).to.equal(0);
	});

	it('should return 1 (player1 wins round) if player1 move beats player2 move', () => {
		expect(game.roundResult('move1', 'move2')).to.equal(1);
	});

	it('should return -1 (player2 wins round) if player2 move beats player1 move', () => {
		expect(game.roundResult('move1', 'move3')).to.equal(-1);
	});

	it('should throw an exception if player1 move or player2 are invalid', () => {
		expect(() => game.roundResult('non_existing_move', 'move1')).to.throw('unknown move(s)');
		expect(() => game.roundResult('move2', 'non_existing_move')).to.throw('unknown move(s)');
		expect(() => game.roundResult('non_existing_move', 'another_non_existing_move')).to.throw('unknown move(s)');
		expect(() => game.roundResult(null, 'move1')).to.throw('unknown move(s)');
		expect(() => game.roundResult('move1', null)).to.throw('unknown move(s)');
		expect(() => game.roundResult(undefined, null)).to.throw('unknown move(s)');
		expect(() => game.roundResult(undefined, 'move1')).to.throw('unknown move(s)');
		expect(() => game.roundResult('move1', undefined)).to.throw('unknown move(s)');
	});

	it('should return a (random) AI move', () => {
		expect(game.getAiMove()).to.equal('move2');
	});

	it('should init to 0 the score for both players', () => {
		game.initGame();
		expect(game.score.p1).to.equal(0);
		expect(game.score.p2).to.equal(0);
	});

	it('should return -1 if no player still reached a score that equals the roundToWin value set in config', () => {
		game.score = {p1: 2, p2: 0};
		expect(game.checkWinner()).to.equal(-1);
	});

	it('should return 1 or 2 (respectively player 1 and player 2) if one of two players reaches a score that equals the roundToWin value set in config', () => {
		game.score = {p1: mockConfig.roundsToWin, p2: 0};
		expect(game.checkWinner()).to.equal(1);

		game.score = {p1: 0, p2: mockConfig.roundsToWin};
		expect(game.checkWinner()).to.equal(2);
	});

	it('should set the game status to "over" when there is a winner', () => {
		game.score = {p1: 0, p2: mockConfig.roundsToWin};
		expect(game.checkWinner()).to.equal(2);
		expect(game.status).to.equal('over');
	});

	it('should reset the score and the status when starting a new game', () => {
		game.score = {p1: 2, p2: 1};
		game.initGame();
		expect(game.score).to.deep.equal({p1: 0, p2: 0});
		expect(game.status).to.equal('running');
	});
});
