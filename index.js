import {lindt, replace_content, on, DOM} from "https://rosuav.github.io/choc/factory.js";
const {DETAILS, DIV, FORM, H3, INPUT, P, SECTION, SUMMARY, TABLE, TD, TR} = lindt; //autoimport

//Transcribed from the KSP Wiki, https://wiki.kerbalspaceprogram.com/wiki/Science#Celestial_body_multipliers
const celestial_bodies = [
	{id: "Sun", name: "Kerbol", gas: true, atmo: "18 km", space: "1000 Mm"}, //CHECK ME: What is the boundary between "in space high" and "low"?
	{id: "Moho", name: "Moho", space: "80 km"}, //CHECK ID
	{id: "Eve", name: "Eve", wet: true, atmo: "22 km", space: "400 km"},
	{id: "Gilly", name: "Gilly", space: "6 km"}, //CHECK ID
	{id: "Kerbin", name: "Kerbin", wet: true, atmo: "18 km", space: "250 km"},
	{id: "Mun", name: "Mun", space: "60 km"},
	{id: "Minmus", name: "Minmus", space: "30 km"},
	{id: "Duna", name: "Duna", atmo: "12 km", space: "140 km"},
	{id: "Ike", name: "Ike", space: "50 km"},
	{id: "Dres", name: "Dres", space: "25 km"}, //CHECK ID
	{id: "Jool", name: "Jool", gas: true, atmo: "120 km", space: "4 Mm"}, //CHECK ID; also check boundary - should this be written as 4000 km?
	{id: "Laythe", name: "Laythe", wet: true, atmo: "10 km", space: "200 km"}, //CHECK ID
	{id: "Vall", name: "Vall", space: "90 km"}, //CHECK ID
	{id: "Tylo", name: "Tylo", space: "250 km"}, //CHECK ID
	{id: "Bop", name: "Bop", space: "25 km"}, //CHECK ID
	{id: "Pol", name: "Pol", space: "22 km"}, //CHECK ID
	{id: "Eeloo", name: "Eeloo", space: "60 km"}, //CHECK ID
];

function sciencedata([biome, data]) {
	const left = +data.cap - +data.sci; //How much more can you learn?
	if (biome) biome += " - ";
	if (!left) return DIV(biome + "Complete"); //Actually nothing here, distinguishable from "0.00" which has underflowed.
	return DIV(biome + left.toFixed(2));
}

function render_game(game) {
	const research = game.SCENARIO.find(s => s.name === "ResearchAndDevelopment");
	let science = research.Science;
	if (!science) science = [];
	else if (!Array.isArray(science)) science = [science];
	const bodies = { }; //Yep, this is where I hid the celestial bodies
	const types = [];
	science.forEach(s => {
		//Each science entry has the following information:
		//id - type "@" body situation [biome]
		//sci - amount of science received from this already
		//cap - total amount of science that can be received from this
		if (s.id.startsWith("recovery@")) return; //Ignore "recovery of a vessel that" as it doesn't follow the normal format (and is less useful anyway)
		const info = /^([^@]+)@(.*?)(SrfLanded|SrfSplashed|FlyingLow|FlyingHigh|InSpaceLow|InSpaceHigh)(.*)$/.exec(s.id)
		const [id, type, body, situ, biome] = info;
		if (!bodies[body]) bodies[body] = {"": []};
		if (!types.includes(type)) types.push(type);
		if (!bodies[body][type]) bodies[body][type] = { };
		const sci = bodies[body][type];
		if (!sci[situ]) sci[situ] = { };
		sci[situ][biome] = s;
		if (biome && !bodies[body][""].includes(biome)) bodies[body][""].push(biome);
	});
	return SECTION([
		H3("Celestial bodies you've visited:"),
		TABLE({border: 1}, celestial_bodies.map(body => {
			if (!bodies[body.id]) return null; //Any celestial body you haven't visited, hide in the list.
			//Valid situations for this celestial body
			const situ = [
				!body.gas && "SrfLanded",
				body.wet && "SrfSplashed",
				body.atmo && "FlyingLow",
				body.atmo && "FlyingHigh",
				"InSpaceLow", "InSpaceHigh", //You can ALWAYS go to space. Unless your flamey end is pointing up. Then you will not go to space today.
			].filter(n => n);
			//List all types of science for which you've ever returned any data
			return types.map((t, i) => {
				const sci = bodies[body.id][t] || { };
				return situ.map((s, j) => {
					return TR([
						//TODO maybe: Distinguish moons from planets by indenting the former?
						!i && !j && TD({rowSpan: types.length * situ.length}, body.name),
						!j && TD({rowSpan: situ.length}, t),
						TD(s),
						TD([
							//TODO: Recognize which type+situ care about biomes
							//TODO: Recognize if a type+situ isn't even valid (eg atmo scan in space low)
							!sci[s] ? "Nothing collected, free to grab!" //Not sure here whether it uses biomes or not
							: sci[s][""] ? sciencedata(["", sci[s][""]])
							: DETAILS([
								//TODO: Show count of untouched biomes for this science type
								SUMMARY("Total " +
									Object.values(sci[s])
									.map(d => +d.cap - +d.sci)
									.reduce((a, b) => a + b, 0)
									.toFixed(2)
									+ " in " + Object.values(sci[s]).length + " biomes"
								),
								//TODO: List biomes in order seen (bodies[body.id][""]) rather than
								//using object iteration order
								Object.entries(sci[s]).map(sciencedata),
							]),
						]),
					]);
				});
			});
		})),
	]);
}

let display_game = null;
function render() {
	replace_content("main", [
		SECTION([
			H3("Upload your save file"),
			P("NOTE: This tool has not been designed with the DLCs in mind. Bug reports welcome!"),
			FORM([
				"Upload your save file here: ",
				INPUT({type: "file", accept: ".sfs"}),
			]),
		]),
		display_game && render_game(display_game),
	]);
}
render();

function set(parent, key, value) {
	//Note that arrays are defined simply by having multiple entries
	//with the same name, so we autoarrayify here when duplicates are
	//found. There is no other provision for arrays, so this should
	//not be able to conflict with anything.
	if (Array.isArray(parent[key])) parent[key].push(value);
	else if (!parent[key]) parent[key] = value;
	else parent[key] = [parent[key], value];
	return value;
}

function parse_savefile(raw) {
	const nest = [{}]; //As nested objects are parsed, they are appended to this.
	for (let line of raw.split("\n")) {
		//Two possibilities.
		//1) Optional indentation, then variable " = " value
		//2) Optional indentation, then variable; the next line is an open brace; build object recursively.
		//3ish) Close brace to mark the end of mode 2.
		line = line.trimStart();
		const m = /^(.*?) = (.*)$/.exec(line);
		if (m) set(nest[nest.length - 1], m[1], m[2]);
		else if (!line) continue; //Ignore blank lines
		else if (line === "{") continue; //Is supposed to come immediately after a bare name, but we don't check
		else if (line === "}") nest.pop(); //End of current object
		else nest.push(set(nest[nest.length - 1], line, { }));
	}
	//assert nest.length === 1
	display_game = nest[0].GAME;
	render();
}

on("change", "input[type=file]", e => {
	for (let f of e.match.files) f.text().then(parse_savefile);
	e.match.value = "";
});
