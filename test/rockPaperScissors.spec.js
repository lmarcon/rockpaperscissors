import config from '../src/js/config';
import mockConfig from './config.mock';
import RockPaperScissors from '../src/js/RockPaperScissors';
import {Spy} from './tools';

describe('RockPaperScissors instance', () => {
	let game = null;

	before(() => {
		let gameWrapper = document.createElement('div');
		gameWrapper.id = 'game';
		document.body.appendChild(gameWrapper);

		game = new RockPaperScissors(config, '#game');
	});

	describe('Instance specific rules', () => {
		describe('Rock', () => {
			it('should return a tie (0) with another rock', () => {
				expect(game.roundResult('rock', 'rock')).to.equal(0);
			});

			it('should return a win (1) with scissors', () => {
				expect(game.roundResult('rock', 'scissors')).to.equal(1);
			});

			it('should return a defeat (-1) with paper', () => {
				expect(game.roundResult('rock', 'paper')).to.equal(-1);
			});
		});

		describe('Scissors', () => {
			it('should return a tie (0) with another scissors', () => {
				expect(game.roundResult('scissors', 'scissors')).to.equal(0);
			});

			it('should return a win (1) with paper', () => {
				expect(game.roundResult('scissors', 'paper')).to.equal(1);
			});

			it('should return a defeat (-1) with rock', () => {
				expect(game.roundResult('scissors', 'rock')).to.equal(-1);
			});
		});

		describe('Paper', () => {
			it('should return a tie (0) with another paper', () => {
				expect(game.roundResult('paper', 'paper')).to.equal(0);
			});

			it('should return a win (1) with rock', () => {
				expect(game.roundResult('paper', 'rock')).to.equal(1);
			});

			it('should return a defeat (-1) with scissors', () => {
				expect(game.roundResult('paper', 'scissors')).to.equal(-1);
			});
		});

	});

	describe('All game modes', () => {
		let game = null;
		before(() => {
			const gameWrapper = document.createElement('div');
			gameWrapper.id = 'game';
			document.body.appendChild(gameWrapper);

			game = new RockPaperScissors(mockConfig, '#game');
		});

		describe('Before a game is started', () => {
			it('should throw an exception if game mode is null, undefined or unknown type', () => {
				expect(() => game.initGame(null)).to.throw('unknown mode');
				expect(() => game.initGame(undefined)).to.throw('unknown mode');
				expect(() => game.initGame('Goofy')).to.throw('unknown mode');
			});

			it('should set the game mode', () => {
				expect(game.status).to.equal('toinit');
				game.initGame('P_VS_AI');
				expect(game.mode).to.equal('P_VS_AI');
				game.initGame('AI_VS_AI');
				expect(game.mode).to.equal('AI_VS_AI');
				expect(game.status).to.equal('running');
			});

			it('should throw an exception if the wrapper is not found', () => {
				expect(() => new RockPaperScissors(mockConfig, '#non_existing')).to.throw('#non_existing element not found');
			});

			it('should inject start game buttons into the markup', () => {
				expect(document.querySelectorAll('#game > .button').length).to.equal(2);
			});

			it('should inject the rules into the markup before starting the game', () => {
				expect(document.querySelectorAll('#game .rules').length).to.equal(1);

				// expected rules: two lines of description, and N lines (see config) of moves related rules
				expect(document.querySelectorAll('#game .rules li').length).to.equal(Object.keys(mockConfig.moves).length + 2);
			});

			it('should start a game when clicking on one of the two buttons', () => {
				let spy = new Spy(game, 'startGame');
				document.querySelectorAll('#game > .button__control')[0].click();
				expect(spy.callCount).to.equal(1);
				document.querySelectorAll('#game > .button__control')[1].click();
				expect(spy.callCount).to.equal(2);
				spy.restore();
			});
		});

		describe('After a game is started', () => {
			before(() => {
				game.startGame('P_VS_AI');
			});

			it('should inject the board into the markup', () => {
				expect(document.querySelectorAll('#game .board').length).to.equal(1);
			});

			it('should inject the score into the markup', () => {
				expect(document.querySelectorAll('#game .score').length).to.equal(1);
			});

			it('should inject the message area into the markup', () => {
				expect(document.querySelectorAll('#game .message').length).to.equal(1);
			});

			it('should show the initial score in the score panels', () => {
				expect(document.querySelector('#game .score__p1').innerHTML).to.equal('0');
				expect(document.querySelector('#game .score__p2').innerHTML).to.equal('0');
			});

			it('should calculate the result of the round if the game is running', () => {
				let spy = new Spy(game, 'roundResult');
				game.initGame('P_VS_AI');
				game.playerMove('move1');
				expect(spy.callCount).to.equal(1);

				spy.restore();
			});

			it('should block any further move when the game status is "over"', () => {
				let spy = new Spy(game, 'roundResult');
				game.status = 'over';
				game.playerMove('move1');
				expect(spy.callCount).to.equal(0);

				spy.restore();
			});

			it('should update the score when player1 or player2, but not on a tie', () => {
				let spy = new Spy(game, 'updateScore');

				game.checkRoundResult(1);
				expect(spy.callCount).to.equal(1);
				game.checkRoundResult(-1);
				expect(spy.callCount).to.equal(2);
				game.checkRoundResult(0);
				expect(spy.callCount).to.equal(2);

				spy.restore();
			});
		});

		after(() => {
			let element = document.querySelector('#game');
			element.parentNode.removeChild(element);
		});
	});

	describe('Player VS AI', () => {
		let game = null;

		before(() => {
			const mockMath = Object.create(global.Math);
			mockMath.random = () => 0.5;
			global.Math = mockMath;

			const gameWrapper = document.createElement('div');
			gameWrapper.id = 'game';
			document.body.appendChild(gameWrapper);

			game = new RockPaperScissors(mockConfig, '#game');
			game.startGame('P_VS_AI');
		});

		it('should show the possible moves to the player', () => {
			expect(document.querySelectorAll('#game .board__p1 button').length).to.equal(game.getPossibleMoves().length);
		});

		it('should show a "waiting for player move" icon on AI board', () => {
			expect(document.querySelectorAll('#game .board__p2 button.button__questionMark').length).to.equal(1);
		});

		it('should trigger an AI move when player moves', () => {
			document.querySelector('#game .board__p1 button.button__move1').click();

			expect(document.querySelectorAll('#game .board__p2 button.button__questionMark').length).to.equal(0);
			expect(document.querySelectorAll('#game .board__p2 button.button__move2').length).to.equal(1);
		});

		it('should update the score after a round', () => {
			game.startGame('P_VS_AI');
			document.querySelector('#game .board__p1 button.button__move1').click();

			expect(document.querySelector('#game .score__p1').innerHTML).to.equal('1');
			expect(document.querySelector('#game .score__p2').innerHTML).to.equal('0');
		});

		it('should not update the score after a tie', () => {
			game.startGame('P_VS_AI');
			document.querySelector('#game .board__p1 button.button__move2').click();

			expect(document.querySelector('#game .score__p1').innerHTML).to.equal('0');
			expect(document.querySelector('#game .score__p2').innerHTML).to.equal('0');
		});

		it('should show a message at the end of the round', () => {
			game.startGame('P_VS_AI');
			document.querySelector('#game .board__p1 button.button__move2').click();

			expect(document.querySelectorAll('#game .message').length).to.equal(1);
		});

		it('should check if there is a winner at every score update', () => {
			let spy = new Spy(game, 'checkWinner');

			game.startGame('P_VS_AI');
			document.querySelector('#game .board__p1 button.button__move1').click();
			expect(spy.callCount).to.equal(1);

			spy.restore();
		});

		it('should remove the current message (if any) at game restart', () => {
			game.startGame('P_VS_AI');
			expect(document.querySelectorAll('#game .message__body').length).to.equal(0);

			document.querySelector('#game .board__p1 button.button__move2').click();
			expect(document.querySelectorAll('#game .message__body').length).to.equal(1);

			game.startGame('P_VS_AI');
			expect(document.querySelectorAll('#game .message__body').length).to.equal(0);
		});

		after(() => {
			let element = document.querySelector('#game');
			element.parentNode.removeChild(element);
		});
	});

	describe('AI VS AI', () => {
		let game = null;

		before(() => {
			const mockMath = Object.create(global.Math);
			mockMath.random = () => 0.5;
			global.Math = mockMath;

			const gameWrapper = document.createElement('div');
			gameWrapper.id = 'game';
			document.body.appendChild(gameWrapper);

			game = new RockPaperScissors(mockConfig, '#game');
			game.startGame('AI_VS_AI');
		});

		it('should start an AI vs AI game', () => {
			let spy = new Spy(game, 'startAiVsAi');

			game.startGame('AI_VS_AI');
			expect(spy.callCount).to.equal(1);

			spy.restore();
		});

		it('should start an interval timer that plays an AI vs AI round', () => {
			let originalSetInterval = global.setInterval;
			let fakeSetInterval = (fn) => { fn(); };
			global.setInterval = fakeSetInterval;
			let spy = new Spy(game, 'aiVsAiRound');

			game.startAiVsAi();
			expect(spy.callCount).to.equal(1);

			global.setInterval = originalSetInterval;
			spy.restore();
		});

		it('should play an AI vs AI round', () => {
			let spyGetAIMove = new Spy(game, 'getAiMove', () => 'move1');
			let spyCheckRoundResult = new Spy(game, 'checkRoundResult');
			game.aiVsAiRound();
			expect(spyCheckRoundResult.callCount).to.equal(1);
			expect(spyGetAIMove.callCount).to.equal(2);
		});

		it('should stop playing if the game is over', () => {
			let spy = new Spy(global, 'clearInterval');

			game.status = 'over';
			game.aiVsAiRound();
			expect(spy.callCount).to.equal(1);

			spy.restore();
		});
	});

	after(() => {
		let element = document.querySelector('#game');
		element.parentNode.removeChild(element);
	});
});
