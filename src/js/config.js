/**
 * describes the rules of the game: every type of move has a list of moves that it beats
 * */

export default {
	roundsToWin: 5,
	moves: {
		rock: [
			"scissors"
		],
		scissors: [
			"paper"
		],
		paper: [
			"rock"
		]
	}
}

/*
Feel free to test other configurations :)

export default {
	roundsToWin: 7,
	moves: {
		rock: [
			"scissors",
			"lizard"
		],
		scissors: [
			"paper",
			"spock"
		],
		paper: [
			"rock",
			"spock"
		],
		lizard: [
			"spock",
			"paper"
		],
		spock: [
			"scissors",
			"rock"
		]
	}
}
*/
