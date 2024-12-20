#!/usr/bin/osascript

ObjC.import("stdlib")

const environment = $.NSProcessInfo.processInfo.environment.js;
const MODE = 'MODE' in environment ? environment.MODE.js : undefined;
const BASE = 'BASE' in environment ? environment.BASE.js : undefined;
const QUICK_LOOK_PATH = BASE + '/'
console.log("Mode: " + MODE);
console.log("Base dir: " + BASE);

// ObjC.import("Foundation");
// const args = $.NSProcessInfo.processInfo.arguments;
// console.log("0: " + args.js[0].js);


let FLAG_DIR = "flags/png1000px/";
let ICON_DIR = "flags/squares/";
let ICON_DIR_ALT = "flags/svg/";
let FILE = "2024_geoguessr.json";

var app = Application.currentApplication()
app.includeStandardAdditions = true

var fm = $.NSFileManager.defaultManager;

function readFile(file, delimiter) {
	// Convert the file to a string
	var fileString = file.toString()

	var contents = fm.contentsAtPath(fileString); // NSData
	contents = $.NSString.alloc.initWithDataEncoding(contents, $.NSUTF8StringEncoding);
	return ObjC.unwrap(contents);


	// Read the file using a specific delimiter and return the results
	//    return app.read(Path(fileString))

}


let script_filter_items = [] // We will build this array with the elements for the Script Filter
var content = JSON.parse(readFile(FILE));

content.forEach(country => { // For each item in your list



	let name = country['country'];
	let uid = country['code'];
	let tld = country['tld'];
	let search = country['search'];
	let letters = country['letters'];
	let cap = country['capital'] ? country['capital'] : "";
	let lc = uid;

	let icon = ICON_DIR + lc + '.svg';
	let alt_icon = ICON_DIR_ALT + lc + '.svg';
	let file = FLAG_DIR + lc + '.png';
	let match = country['search'];

	if (MODE === "LETTER") {
		if (letters) {
			var element = {
				'uid': uid,
				'title': letters,
				'subtitle': name,
				'match': search + ' ' + letters,
				'icon': {
					'path': icon
				}
			}
			script_filter_items.push(element)
		}
	} else if (MODE === "TLD") {
		if (tld) {
			var element = {
				'uid': uid,
				'autocomplete': tld,
				'title': name,
				'subtitle': tld,
				'match': tld,
				'icon': {
					'path': icon
				}
			}
			script_filter_items.push(element)
		}
	} else if (MODE === "COUNTRY") {
		let lc_name = name.toLowerCase();

		var element = {
			'uid': uid,
			'type': 'file:skipcheck',
			'autocomplete': name,
			'title': name,
			'match': name,
			'arg': lc_name,
			'icon': {
				'path': icon
			}
		}
		script_filter_items.push(element)
	} else {
		var element = {
			'uid': uid,
			'type': 'file:skipcheck',
			'autocomplete': name,
			'title': name + ' (.' + tld + ')',
			'subtitle': cap,
			'match': match,
			'arg': file,
			'icon': {
				'path': icon
			},
			"quicklookurl": QUICK_LOOK_PATH + file,

			"mods": {
				"alt": {
					'icon': {
						'path': alt_icon
					}
				}
			}
		}
		script_filter_items.push(element)
	}

});

JSON.stringify({
	'cache': {
		'seconds': 3600,
		"loosereload": true
	},
	'items': script_filter_items
})
