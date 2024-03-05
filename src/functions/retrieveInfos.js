import { log, recapBotsErrors, searchChannelInGuild, writeJsonFile, readJsonFile } from './functions.js'
import config from '../config.json' assert { type: 'json' };


export function retrieveAndPrintInfos(){

	const data = retrieveData();

}



//planet_status


async function retrieveData(){

	//const response = await fetch('https://helldivers-2.fly.dev/api/801/status')
	//const response = await answer.json()
	let data = false

	/*
	try {
	    const response = await fetch('https://helldivers-2.fly.dev/api/801/status');
	    
	    if (!response.ok) {
	    	log('ERROR : HTTP ' + response.status)
	        throw new Error('ERROR : HTTP ' + response.status);
	    }
	    else{
	    	data = await response.json();
	    }

	} catch (error) {
		data = false
	    log("ERROR : "+error);
	}
	*/
	

	data = await readJsonFile("./src/data.json")

	let sortedPlanet = {}

	if(data){
		let countUnknown = 0

		let planets = {}

		//console.log(data)
		//await writeJsonFile("./src", "data.json", data)
		//console.log(data.planet_status);

		for (let obj in data.planet_status){

			const tmp = data.planet_status[obj]
			if(tmp.health != tmp.planet.max_health){

				let name
				if(tmp.planet.name){
					name = tmp.planet.name
				}
				else{
					name = "Unkown_"+ countUnknown
					countUnknown ++
				}

				planets[name] = {
				  health: tmp.health,
				  max_health: tmp.planet.max_health,
				  players:tmp.players
				};
			}
		}

		sortedPlanet['Attaque'] = {
			type: "Attaque",
			planets
		}

		//console.log(planets)
		planets = {}

		for (let planetTMP of data.planet_events) {
			console.log(planetTMP.max_health); // Santé max augmenté pour la défense (pas rangé au même endroit)
			console.log(planetTMP.health); // Santé restante de la planète (pas rangé au même endroit)
		  	console.log(planetTMP.planet.name); // Accédez aux propriétés des planètes
		  	console.log(planetTMP.expire_time); // date / heure à laquelle la défense se termine !

			if(planetTMP.health != planetTMP.max_health){

				let name
				if(planetTMP.planet.name){
					name = planetTMP.planet.name
				}
				else{
					name = "Unkown_"+ countUnknown
					countUnknown ++
				}

				planets[name] = {
				  health: planetTMP.health,
				  max_health: planetTMP.planet.max_health
				};
			}
		}

		sortedPlanet['Defense'] = {
			type: "Defense",
			planets
		}
	}

	console.log(sortedPlanet)
	//fetch('https://helldivers-2.fly.dev/api/801/status')
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Erreur HTTP ' + response.status);
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.error('Erreur :', error);
    // });



}