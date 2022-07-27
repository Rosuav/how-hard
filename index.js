import {choc, lindt, replace_content, on, DOM} from "https://rosuav.github.io/choc/factory.js";
const {B, DETAILS, DIV, FORM, H3, I, INPUT, P, SECTION, SUMMARY, TABLE, TD, TR} = lindt; //autoimport

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

//Parsed from GameData/Squad/Resources/ScienceDefs.cfg which is the creation of
//the Squad developers. Used only in conjunction with the game itself, as there's
//no way to usefully analyze a savefile if you're not playing the game! Go buy it,
//if you don't already; it's absolutely worth it.
const experiments = {"crewReport":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"5","atmo":false},"evaReport":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"InSpaceLow":1},"total":"8","atmo":false},"mysteryGoo":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1},"total":"13","atmo":false},"surfaceSample":{"situ":{"SrfLanded":1,"SrfSplashed":1},"biomes":{"SrfLanded":1,"SrfSplashed":1},"total":"40","atmo":false},"mobileMaterialsLab":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1},"total":"32","atmo":false},"temperatureScan":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"8","atmo":false},"barometerScan":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1},"total":"12","atmo":false},"seismicScan":{"situ":{"SrfLanded":1},"biomes":{"SrfLanded":1},"total":"22\t","atmo":false},"gravityScan":{"situ":{"SrfLanded":1,"SrfSplashed":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"InSpaceLow":1,"InSpaceHigh":1},"total":"22","atmo":false},"atmosphereAnalysis":{"situ":{"SrfLanded":1,"FlyingLow":1,"FlyingHigh":1},"biomes":{"SrfLanded":1,"FlyingLow":1,"FlyingHigh":1},"total":"24","atmo":true},"asteroidSample":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"70","atmo":false},"cometSample_short":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"100","atmo":false},"cometSample_intermediate":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"150","atmo":false},"cometSample_long":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"300","atmo":false},"cometSample_interstellar":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1},"total":"1000","atmo":false},"infraredTelescope":{"situ":{"InSpaceHigh":1},"biomes":{},"total":"22","atmo":false},"magnetometer":{"situ":{"InSpaceLow":1,"InSpaceHigh":1},"biomes":{},"total":"45","atmo":false},"evaScience":{"situ":{"SrfLanded":1,"SrfSplashed":1,"FlyingLow":1,"FlyingHigh":1,"InSpaceLow":1,"InSpaceHigh":1},"biomes":{},"total":"25","atmo":false}};
const experiunknown = {situ: mask_to_kwd(-1), biomes: mask_to_kwd(-1), total: 1, atmo: false};

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
		if (!bodies[body]) bodies[body] = {"-dry": [], "-wet": []};
		if (!types.includes(type)) types.push(type);
		if (!bodies[body][type]) bodies[body][type] = { };
		const sci = bodies[body][type];
		if (!sci[situ]) sci[situ] = { };
		sci[situ][biome] = s;
		if (biome) {
			const arr = bodies[body][situ === "SrfSplashed" ? "-wet" : "-dry"];
			if (!arr.includes(biome)) arr.push(biome);
		}
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
			//Spoiler-free list of biomes for the current celestial body. If you've
			//never received any science from a biome, it won't be listed; but if (say)
			//you get a crew report from the surface there, it'll then say that you
			//could also get a crew report flying low over it. Note that SrfSplashed is
			//special, and does not contribute to the general list of biomes, nor does
			//it follow that list; instead, it has its own list of biomes, probably a
			//much smaller one.
			const drybiomes = bodies[body.id]["-dry"], wetbiomes = bodies[body.id]["-wet"];
			//Some experiments don't make sense when there's no atmosphere.
			const curtypes = body.atmo ? types
				: types.filter(t => !experiments[t] || !experiments[t].atmo);
			//Since rowspan has to be on the FIRST row, not the LAST, we need to
			//calculate the total number of rows first.
			let fullspan = 0;
			curtypes.forEach(t => {
				const expsitu = (experiments[t] || experiunknown).situ;
				situ.forEach(s => expsitu[s] && ++fullspan);
			});
			//List all types of science for which you've ever returned any data
			return curtypes.map((t, i) => {
				const sci = bodies[body.id][t] || { };
				const exp = experiments[t] || experiunknown;
				const cursitu = situ.filter(s => exp.situ[s]); //Experiments valid in this situation
				return cursitu.map((s, j) => {
					let tot = 0, nonempty = 0, empty = 0;
					//If we have non-biome data for this, assume it's a non-biome experiment.
					//This takes care of unknown experiment types (if we don't have all data)
					//while not being entirely borked.
					const cur = sci[s] || { };
					//Figure out the cap. Since biomes don't affect the cap, we can take any
					//experiment result for this body and situation, and the cap will be the
					//same; this means that the only case we can't determine this way is the
					//case where we have no data whatsoever, which can be abbreviated.
					const anydata = Object.values(cur)[0];
					const cap = anydata ? +anydata.cap : 0;
					const biomes = (cur[""] || !exp.biomes[s] ? [""] : s === "SrfSplashed" ? wetbiomes : drybiomes).map(biome => {
						const data = cur[biome];
						if (biome) biome = " - " + biome;
						if (!data) {++empty; tot += cap; return DIV([cap && cap.toFixed(2), B(biome + " (pristine)")]);}
						++nonempty;
						const left = +data.cap - +data.sci; //How much more can you learn?
						tot += left;
						if (!left) biome += " (complete)"; //Actually nothing here, not merely underflowed.
						if (left < 1.0) return DIV([left.toFixed(2), I(biome)]);
						return DIV(left.toFixed(2) + biome);
					});
					return TR([
						//TODO maybe: Distinguish moons from planets by indenting the former?
						!i && !j && TD({rowSpan: fullspan}, body.name),
						!j && TD({rowSpan: cursitu.length}, t),
						TD(s),
						TD([
							biomes.length === 0 ? B("(all biomes pristine)") :
							biomes.length === 1 ? biomes[0] //Non-biome experiments don't need a summary.
							: DETAILS([
								SUMMARY(`Total ${tot.toFixed(2)} in ${nonempty}+${empty}  biomes`),
								biomes,
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

function mask_to_kwd(n) {
	const ret = { };
	"SrfLanded SrfSplashed FlyingLow FlyingHigh InSpaceLow InSpaceHigh".split(" ")
	.forEach((k, i) => (n & (1<<i)) && (ret[k] = 1));
	return ret;
}

function parse_science_data(exps) {
	const science = { };
	exps.forEach(exp => science[exp.id] = {
		situ: mask_to_kwd(exp.situationMask|0),
		biomes: mask_to_kwd(exp.biomeMask|0),
		total: exp.scienceCap, //Total amount of science that can be obtained from this (scaled by body and situation)
		atmo: exp.requireAtmosphere === "True", //If true, suppress this completely on bodies with no atmosphere
	});
	document.body.appendChild(choc.PRE(JSON.stringify(science)));
}

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
		line = line.trimStart().split("//")[0]; //I don't know if there's a way to quote a string so it contains a double slash
		const m = /^(.*?) = (.*)$/.exec(line);
		line = line.trim();
		if (m) set(nest[nest.length - 1], m[1], m[2]);
		else if (!line) continue; //Ignore blank lines
		else if (line === "{") continue; //Is supposed to come immediately after a bare name, but we don't check
		else if (line === "}") nest.pop(); //End of current object
		else nest.push(set(nest[nest.length - 1], line, { }));
	}
	//assert nest.length === 1
	if (nest[0].EXPERIMENT_DEFINITION) {parse_science_data(nest[0].EXPERIMENT_DEFINITION); return;} //Hack
	display_game = nest[0].GAME;
	render();
}

on("change", "input[type=file]", e => {
	for (let f of e.match.files) f.text().then(parse_savefile);
	e.match.value = "";
});
