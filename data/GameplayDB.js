 var allRewards=
 {"rewards": 
	[
		{
			"name":"THREE",
			"points":500,
		},
		{
			"name":"FOUR",
			"points":750,
			"powerup":["BOMB"],
		},
		{
			"name":"L",
			"points":1500,
			"powerup":["COL_REMOVE"],
		},
		{
			"name":"T",
			"points":1750,
			"powerup":["COLOR_BLAST"],
		},
		{
			"name":"FIVE",
			"points":2000,
			"powerup":["MEGABOMB", "PLUS_2"],
		},
		{
			"name":"SIX",
			"points":3500,
			"powerup":["MEGABOMB", "PLUS_2"],
		},
		{
			"name":"BIG_T",
			"points":3000,
			"powerup":["MEGABOMB", "PLUS_2"],
		},
		{
			"name":"SINGLE",
			"points":100,
		},
	]
 }
 
function GameplayDB() {
}

GameplayDB.prototype.getAllRewards= function() {
	return allRewards.rewards;
}