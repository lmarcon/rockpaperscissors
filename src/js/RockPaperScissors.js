/**
 * Web version of Rock Paper Scissors, extending the base game engine
 */

import {buttonFactory, divFactory, splitFactory, messageFactory, listFactory} from './factories';
import Game from './Game';

/**
 * Possible game modes
 * @type {[*]}
 */
const GameModes = ['P_VS_AI', 'AI_VS_AI'];

export default class RockPaperScissors extends Game {
	/**
	 * Instantiate the game, sets the main wrapper element for this instance and renders the initial markup
	 * @param config
	 * @param domElementSelector
	 */
	constructor(config, domElementSelector) {
		super(config);

		this.wrapper = document.querySelector(domElementSelector);
		if (this.wrapper) {
			this.initHtml();
		} else {
			throw `${domElementSelector} element not found`;
		}
	}

	/**
	 * Extends the basic initialization with adding the support for different game modes
	 * @param gameMode
	 */
	initGame(gameMode) {
		if (gameMode === null || gameMode === undefined || GameModes.indexOf(gameMode) === -1) {
			throw 'unknown mode';
		}

		this.mode = gameMode;

		super.initGame();
	}

	/**
	 * Prepares the dom elements that will be used in the game, and renders the initial markup
	 */
	initHtml() {
		this.wrapper.innerHTML = '';

		this.gameElements = {
			pVsAi: buttonFactory('control', 'Start a new game - Player VS AI', () => this.startGame('P_VS_AI')),
			aiVsAi: buttonFactory('control', 'Start a new game - AI VS AI', () => this.startGame('AI_VS_AI')),
			board: splitFactory('board'),
			score: splitFactory('score'),
			icons: {
				questionMark: () => buttonFactory('questionMark')
			},
			message: divFactory('message'),
			rules: this.getRules()
		};

		this.getPossibleMoves().forEach(move => {
			this.gameElements.icons[move] = (onClick) => buttonFactory(move, '', onClick);
		});

		this.wrapper.appendChild(this.gameElements.pVsAi);
		this.wrapper.appendChild(this.gameElements.aiVsAi);
		this.wrapper.appendChild(this.gameElements.rules);
	}

	/**
	 * Dynamically generates a rules of the game panel from the configuration
	 * @returns {Element}
	 */
	getRules() {
		let rules = divFactory('rules');
		let list = [];

		list.push('Two game modes available: player vs AI and AI vs AI.');
		list.push(`The first one that wins ${this.config.roundsToWin} rounds wins the game.`);
		Object.keys(this.config.moves).forEach(move => {
			list.push(`${move} beats ` + this.config.moves[move].join(', '));
		});
		rules.appendChild(listFactory(list));

		return rules;
	}

	/**
	 * Starts a game in one of the available modes. Renders the board accordingly to the chosen mode
	 * @param gameMode
	 */
	startGame(gameMode) {
		if (this.status === 'toinit') {
			this.gameElements.rules.parentNode.removeChild(this.gameElements.rules);
		}

		this.initGame(gameMode);

		clearInterval(this.gameTick);
		this.gameElements.message.innerHTML = '';
		this.gameElements.board.p1.innerHTML = '';
		this.gameElements.board.p2.innerHTML = '';

		this.wrapper.appendChild(this.gameElements.board);
		this.wrapper.appendChild(this.gameElements.score);
		this.wrapper.appendChild(this.gameElements.message);

		if (this.mode === 'P_VS_AI') {
			this.getPossibleMoves().forEach(move => {
				this.gameElements.board.p1.appendChild(this.gameElements.icons[move](() => this.playerMove(move)));
			});

			this.gameElements.board.p2.appendChild(this.gameElements.icons.questionMark());
		} else if (this.mode === 'AI_VS_AI') {
			this.startAiVsAi();
		}

		this.gameElements.score.p1.innerHTML = this.score.p1;
		this.gameElements.score.p2.innerHTML = this.score.p2;
	}

	/**
	 * Starts a game between two AIs, triggering a new round every 3 seconds
	 */
	startAiVsAi() {
		this.gameElements.board.p1.innerHTML = '';
		this.gameElements.board.p1.appendChild(this.gameElements.icons.questionMark());

		this.gameElements.board.p2.innerHTML = '';
		this.gameElements.board.p2.appendChild(this.gameElements.icons.questionMark());

		this.gameTick = setInterval(() => {
			this.aiVsAiRound();
		}, 3000);
	}

	/**
	 * Starts a new AI vs AI round, checks the round result and if there's a game winner
	 */
	aiVsAiRound() {
		let ai1Move = this.getAiMove();
		let ai2Move = this.getAiMove();
		this.gameElements.board.p1.innerHTML = '';
		this.gameElements.board.p1.appendChild(this.gameElements.icons[ai1Move]());
		this.gameElements.board.p2.innerHTML = '';
		this.gameElements.board.p2.appendChild(this.gameElements.icons[ai2Move]());

		this.checkRoundResult(this.roundResult(ai1Move, ai2Move));

		if (this.status === 'over') {
			clearInterval(this.gameTick);
		}
	}

	/**
	 * Execute a move by a human player, instantly followed by a AI move. Then checks the result of the round
	 * @param playerMove
	 */
	playerMove(playerMove) {
		if (this.status === 'over') {
			return;
		}

		let aiMove = this.getAiMove();

		this.gameElements.board.p2.innerHTML = '';
		this.gameElements.board.p2.appendChild(this.gameElements.icons[aiMove]());

		this.checkRoundResult(this.roundResult(playerMove, aiMove));
	}

	/**
	 * Checks the result of a round. If there's a winner, updates the score
	 * @param roundResult
	 */
	checkRoundResult(roundResult) {
		if (roundResult === 1) {
			this.score.p1++;
			this.showMessage('Player 1 won this round!');
			this.updateScore();
		} else if (roundResult === -1) {
			this.score.p2++;
			this.showMessage('Player 2 won this round!');
			this.updateScore();
		} else {
			this.showMessage('TIE!');
		}
	}

	/**
	 * Updates the score board and checks if there is a winner of the game
	 */
	updateScore() {
		let winner = this.checkWinner();
		if (winner !== -1) {
			// we have a winner
			this.showMessage(`GAME OVER! Player ${winner} won the game!`);
		}

		this.gameElements.score.p1.innerHTML = this.score.p1;
		this.gameElements.score.p2.innerHTML = this.score.p2;
	}

	/**
	 * Show a message in the message area
	 * @param msg
	 */
	showMessage(msg) {
		this.gameElements.message.innerHTML = '';
		this.gameElements.message.appendChild(messageFactory(msg));
	}
}

