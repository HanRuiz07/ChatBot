    import { createBot, MemoryDB } from '@builderbot/bot'
    import { schedule } from 'node-cron'
    import { provider } from './Prooverdor/provider'
    import { join } from 'path'

    import * as dotenv from 'dotenv'
    import fetch from 'node-fetch'

    import Flujos from './Flujos'
    import { conPostgres } from './Servicios/postresql'
   
    dotenv.config();

    const PORT = process.env.PORT

    const main = async () => {

        conPostgres();

        const { handleCtx, httpServer } = await createBot({
            database: new MemoryDB,
            provider,
            flow: Flujos 
        })

        provider.server.post(
            '/v1/messages',
            handleCtx(async (bot, req, res) => {
                const { number, message, urlMedia } = req.body
                await bot.sendMessage(number, message, { media: urlMedia ?? null })
                return res.end('sended')
            })
        )

        provider.server.post(
            '/v1/register',
            handleCtx(async (bot, req, res) => {
                const { number, name } = req.body
                await bot.dispatch('REGISTER_FLOW', { from: number, name })
                return res.end('trigger')
            })
        )

        provider.server.post(
            '/v1/samples',
            handleCtx(async (bot, req, res) => {
                const { number, name } = req.body
                await bot.dispatch('SAMPLES', { from: number, name })
                return res.end('trigger')
            })
        )

        provider.server.post(
            '/v1/blacklist',
            handleCtx(async (bot, req, res) => {
                const { number, intent } = req.body
                if (intent === 'remove') bot.blacklist.remove(number)
                if (intent === 'add') bot.blacklist.add(number)

                res.writeHead(200, { 'Content-Type': 'application/json' })
                return res.end(JSON.stringify({ status: 'ok', number, intent }))
            })
        )

        httpServer(+PORT)
    }

    main()
