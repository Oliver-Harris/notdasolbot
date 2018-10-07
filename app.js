const fs = require('fs');
const tmi = require('tmi.js');
const command = require('./data/commands');

let data = {
	hidden: {}
};

data.hidden = fs.readFileSync('data/config.json');
const hidden = JSON.parse(data.hidden);

let options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: "true"
	},
	identity: {
		username:hidden.username,
		password: hidden.oauth
	},
	channels: hidden.channels
};

let client = new tmi.client(options);
client.connect();

function load(c) {
	console.log("Loading Channel: " + c);
	client.say(c, hidden.welcome);
};

client.on('connected', function(address, port) {
	console.log("Address " + address);
	console.log("Port " + port);

	for (let i = 0; i < hidden.channels.length; i++) {
		load(hidden.channels[i]);
	};
});

client.on('chat', function(channel, user, message, self) {
	if (self) {
		return;
	}
	for (let i = 0; i < command.length; i++) {
		if (message == (command[i].trigger)) {
			client.say(channel, command[i].response);
		};
	};
});
