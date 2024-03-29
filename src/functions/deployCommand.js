import { log } from './functions.js';
import { listJsonFile, readJsonFile } from './functions.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export async function deployCommand(client){

  // Import commands files
  const listFile = await listJsonFile('./src/commands/')

  if (!listFile){
    log('WARNING : Impossible to list files in deployCommand()')
    return false
  }

  // Create slash commands
  let createdCommand = []
  for (const file of listFile) {

    try{

      const command = await readJsonFile(`./src/commands/${file}`, 'utf8')

      let commandData = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)

      // // Add options to the command
      if (command.options) {
        for (const optionC of command.options) {

          switch (optionC.type) {
            case 3:
              commandData.addStringOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;
              
            case 4:
              commandData.addIntegerOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            case 5:
              commandData.addBooleanOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            case 6:
              commandData.addUserOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            case 7:
              commandData.addChannelOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            case 8:
              commandData.addRoleOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            case 9:
              commandData.addMentionableOption(option =>
                  option.setName(optionC.name)
                      .setDescription(optionC.description)
                      .setRequired(optionC.required)
              );
              break;

            default:
              log(`ERROR : Invalid option type for ${option.name} in ${file}`);
              break;
          }
        }
      }

      await client.application.commands.create(commandData);
      createdCommand.push(command.name)
    }
    catch(err){
      log(`ERROR : Impossible to create the ${file.split('.json')[0]} command : ${err}`)
    }
    
  }

  log(`Created global command ${createdCommand.length}/${listFile.length} : ${createdCommand}`)
}