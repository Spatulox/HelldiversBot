/*function main(){
	
	const file = require('test.json')
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.example.com/data.json', true);
	xhr.send();


	xhr.onreadystatechange = function() {
    	if (xhr.readyState === 4 && xhr.status === 200) {
        	console.log(xhr.responseText);
    	}
	};

	console.log("coucou");


}*/


/**********************************************************************
Author : Marc Lecomte
Date : 18/10/2023


main file for the moment






***********************************************************************/
import { Client, GatewayIntentBits } from 'discord.js';
import Discord from 'discord.js'

// Files
import config from './config.json' assert { type: 'json' };

// Functions
//import { addReactions } from './functionnalities/reactions.js'
import { log, recapBotsErrors } from './Functions/functions.js'
import { checkInternetCo } from './functions/checkInternetCo.js'
import { deployCommand } from './functions/deployCommand.js';
import { executeSlashCommand } from './functions/executeCommand.js';



async function loginBot(client) {

	var ok = 'Not Connected'
	if (config.token != ""){

		while(ok == 'Not Connected'){
			ok = await client.login(config.token)
				.then(() => {
					log('Logged in successfully!');
					return 'Connected'
				})
				.catch(async (err) => {
					log(`ERROR : ${err}, retrying...`);
					new Promise(resolve => setTimeout(resolve, 30000));
					return 'Not Connected'
				});
		}
	}
	else{
		log('ERROR : Please enter a valid Discord token....')
		return false
	}
}




function main(){

	log('----------------------------------------------------')
	checkInternetCo()
    .then(() => {

		//Creating a client
		log('Starting program')
		log(`Using discord.js version: ${Discord.version}`);
		log('Creating Client')
		const client = new Client({ intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.DirectMessageReactions,
			],
		});

		//console.log(config);

		log('Trying to connect to Discord Servers')
		var tmp = loginBot(client)
		if (!tmp)
		{
			log('Stopping program')
			process.exit()
		}
	
		// Bot go online
		client.login(config.botToken);

		client.on('ready', async () => {
			log(`${client.user.username} has logged in, waiting...`)
			client.user.setActivity({
				name:"Seems like I'm in developpement..."
				// name:"Just testing the bot in real condition"
			})

			client.user.setStatus('dnd');

			log('Deploying slashes commands')
			await deployCommand(client)
			// process.exit()

			// try{
				//functionName
				//setInterval(function(){functionName;}, 3600000)
				// setInterval(function(){recupLatestVideo(client);}, 900000)
				
			// }
			// catch(error){
			// 	log(error)
			// }
	    })

		client.on('interactionCreate', async (interaction) => {

			executeSlashCommand(interaction, client)
		  });
	});
}






main()