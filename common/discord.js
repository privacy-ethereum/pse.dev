import { REST } from '@discordjs/rest'
import { Client, Routes } from 'discord.js'
import { config } from 'dotenv'

config()

// @ts-expect-error - process.env is not defined
// eslint-disable-next-line no-undef
const TOKEN = process.env.DISCORD_TOKEN || process.env.NEXT_PUBLIC_DISCORD_TOKEN
const MESSAGES_LIMIT = 1 // Number of messages to retrieve from the discord channel
// @ts-expect-error - process.env is not defined
// eslint-disable-next-line no-undef
const GUILD_ID =
  process.env.DISCORD_GUILD_ID || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
})

const rest = new REST({ version: '10' }).setToken(TOKEN)

export const getAnnouncementChannelMessages = async () => {
  try {
    if (!TOKEN) {
      return Promise.reject('Discord token is required')
    }

    if (!GUILD_ID) {
      return Promise.reject('Discord guild id is required')
    }
    console.log('Retrieve announcements from discord channel...')
    const MESSAGES_URL = `${Routes.channelMessages(GUILD_ID)}?limit=${MESSAGES_LIMIT}`
    // If operating on a guild channel, this endpoint requires the current user to have the VIEW_CHANNEL permission
    const messages = await rest.get(MESSAGES_URL)
    return messages
  } catch (err) {
    return Promise.reject(err)
  }
}

const runDiscordBot = () => {
  client.login(TOKEN)
  client.on('ready', async () => {
    await getAnnouncementChannelMessages()
  })
}

runDiscordBot()
