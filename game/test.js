let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

class Vec {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	plus(other) {
		return new Vec(this.x + other.x, this.y + other.y);
	}
	times(factor) {
		return new Vec(this.x * factor, this.y * factor);
	}
}

class Level {
	constructor(plan) {
		let rows = plan
			.trim()
			.split("\n")
			.map((l) => [...l]);
		console.log(`rows: ${rows}`);
		this.height = rows.length;
		this.width = rows[0].length;
		this.startActors = [];

		this.rows = rows.map((row, y) => {
			return row.map((ch, x) => {
				let type = levelChars[ch];
				if (typeof type == "string") return type;
				this.startActors.push(type.create(new Vec(x, y), ch)); // the second argument only applies to the lavas (=, |, v)
				return "empty"; //will also return empty for moving objects (@,o,=,|,V)
			});
		});
	}
}

/* As the actors in the level will change positions and appearances, we'll use a "State" class
 to track the state of a running game */
class State {
	constructor(level, actors, status) {
		this.level = level;
		this.actors = actors;
		this.status = status;
	}

	static start(level) {
		return new State(level, level.startActors, "playing");
	}

	get player() {
		return this.actors.find((a) => a.type == "player");
	}
}

class Player {
	constructor(pos, speed) {
		this.pos = pos;
		this.speed = speed;
	}

	get type() {
		return "player";
	}

	static create(pos) {
        //note: as the player size is 1.5 high its initial position is set with plus(new Vec(0, -0.5)) to ensure it's bottom corresponds with the bottom of the @ character
		return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
	}
}

// the size property is the same for all instances of player, so it's stored on the prototype rather than the instance itself
//  could have used a getter like player.type but, that would create and returna  new Vec object everytime the property is read which would be wasteful.
Player.prototype.size = new Vec(0.8, 1.5);
