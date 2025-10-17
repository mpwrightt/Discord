import { Events, Interaction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction) {
  const client = interaction.client as ExtendedClient;

  // Handle autocomplete interactions
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`❌ No command matching ${interaction.commandName} was found.`);
      return;
    }

    // Check if command has autocomplete handler
    if (!command.autocomplete) {
      console.error(`❌ Command ${interaction.commandName} has no autocomplete handler`);
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`❌ Error in autocomplete for ${interaction.commandName}:`, error);
    }
    return;
  }

  // Handle chat input commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`❌ No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error executing ${interaction.commandName}:`, error);
      const errorMessage = { content: '❌ There was an error executing this command!', ephemeral: true };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
}
