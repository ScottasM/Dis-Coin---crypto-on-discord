const { Client, Intents, Collection } = require('discord.js');
const config = require('./config.json');



require('./Globals.js');
require('./Functions');
require('./TransactionWatch');



/* event/command handler is from https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/a-basic-command-handler.md Thanks man
   prefix is in events/message.js
*/

global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

global.client.commands = new Collection(); 

const { builtinModules } = require('module');

global.client.once('ready', () => {
	console.log('Ready!');
});

process.on
(
    'uncaughtException',
    function (err)
    {
        console.log(err)
        var stack = err.stack;
        //you can also notify the err/stack to support via email or other APIs
    }
);

// 
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {

		if (!file.endsWith(".js")) return;

		const event = require(`./events/${file}`);

		let eventName = file.split(".")[0];

		global.client.on(eventName, event.bind(null, global.client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		global.client.commands.set(commandName, props);
	});
});

/*setInterval(function StatusUpdate(){
	global.client.user.setActivity(`${Object.keys(global.UserData).length} wallets. ${global.Price} $/DCoin`,{type:"WATCHING"});
}, 10000);*/

global.client.login(config.token);  



