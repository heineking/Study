const simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

const vec = (x, y) => ({
	x, y,
	plus({ x: dx, y: dy }) {
		return vec(x + dx, y + dy);
	},
	times(factor) {
		return vec(x * factor, y * factor);
	}
});

const store = (() => {
	// state
	let state = {
		status: "",
		level: {
			height: 0,
			width: 0,
			rows: []
		},
		actors: [],
	};

	// getters
	Object.defineProperty(state, "player", {
		get() {
			return state.actors.find(a => a.type === "player");
		}
	});

	// reducers
	const mutations = {
		initialize(state, { plan }) {
			const rows = plan.trim().split(/\r?\n/).map(row => [...row]);
			return {
				...state,
				level: {
					height: rows.length,
					width: rows[0].length,
					rows,
				},
			};
		},
	};

	const reducer = (state, { type, payload }) => {
		const mutation = mutations[type];
		return mutation ? mutation(state, payload) : state;
	};
	
	const dispatch = (action) => {
		const nextState = reducer(state, action);
		if (nextState !== state) {
			console.log(state, nextState);
			state = nextState;
		}
	};

	return { dispatch };
})();

store.dispatch({
	type: "initialize",
	payload: {
		plan: simpleLevelPlan
	},
});

const app = document.getElementById("level");
app.textContent = simpleLevelPlan;