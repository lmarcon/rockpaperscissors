/**
 * The game engine
 */

export default class Game {
	/**
	 * Builds a new game instance and performs basic checks to the config
	 * @param config
	 */
	constructor(config) {
		if (config === null || config === undefined || typeof config !== 'object' || Object.keys(config).length === 0) {
			throw 'bad config';
		}

		this.status = 'toinit';
		this.config = config;
	}

	/**
	 * Initializes the game status and initial score
	 */
	initGame() {
		this.status = 'running';
		this.score = {
			p1: 0,
			p2: 0
		};
	}

	/**
	 * Checks if one player reached a score >= to the number of rounds needed to win (set in config)
	 * @returns {number}
	 */
	checkWinner() {
		if (this.score.p1 >= this.config.roundsToWin) {
			this.status = 'over';
			return 1;
		}

		if (this.score.p2 >= this.config.roundsToWin) {
			this.status = 'over';
			return 2;
		}

		return -1;
	}

	/**
	 * Returns a random move from the ones available
	 * @returns {*}
	 */
	getAiMove() {
		return this.getPossibleMoves()[Math.floor(Math.random() * (this.getPossibleMoves().length))];
	}

	/**
	 * Returns all the possible moves for the game (set in config)
	 * @returns {Array}
	 */
	getPossibleMoves() {
		return Object.keys(this.config.moves);
	}

	/**
	 * Calculate the result of the round from the moves of the two players
	 * @param player1Move
	 * @param player2Move
	 * @returns {number} 0 = tie, 1 = player1 won, -1 = player2 won
	 */
	roundResult(player1Move, player2Move) {
		if (this.getPossibleMoves().indexOf(player1Move) === -1 || this.getPossibleMoves().indexOf(player2Move) === -1) {
			throw 'unknown move(s)';
		}

		if (player1Move === player2Move) {
			return 0;
		}

		if (this.config.moves[player1Move].indexOf(player2Move) !== -1) {
			return 1;
		}

		return -1;
	}
}
