import "dotenv/config"
import { createBot, utils } from '@builderbot/bot'
import { MemoryDB } from '@builderbot/bot'
import { provider } from "./provider"
import { conPostgres } from "./services/postgresql"
import { schedule } from 'node-cron'
import flow from "./flow"
import { generateTimer } from "./utils/utils"

const PORT = process.env.PORT ?? 3008

const main = async () => {

    conPostgres()

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider,
        flow
    }, {
        queue: {
            timeout: 20000, //👌
            concurrencyLimit: 50 //👌
        }
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

    // Obligatorio para verificar si el bot esta funcionando o se bloqueo
    provider.server.post(
        '/v1/connection',
        handleCtx(async (bot, req, res) => {
            const { number, message } = req.body
            const fullNumber = '51' + number
            try {
                const onWhats = await provider.vendor.onWhatsApp(fullNumber);
                if (onWhats[0]?.exists) {
                    if (message) {
                        await bot.sendMessage(fullNumber, message, {})
                    }
                    return res.end(JSON.stringify({
                        status: 'success',
                        code: number,  // Código en vez de number
                        message: 'El mensaje fue enviado correctamente'
                    }))
                } else {
                    return res.end(JSON.stringify({
                        status: 'warning',
                        code: number,
                        message: 'El número no está registrado en WhatsApp'
                    }))
                }
            } catch (error: any) {
                return res.end(JSON.stringify({
                    status: 'error',
                    code: number,
                    message: error.message || 'Error desconocido'
                }))
            }
        })
    )

    httpServer(+PORT)

    /**
     * It is recommended to have an array of messages with which you will 
     * greet or make that first contact with the user to
     * avoid robotic behavior and possible bans
     */

    schedule('0 13 * * *', async () => {
        console.log('enviando recordatorios');
        try {
            const response = await fetch('http://your.api/users')
            const data = await response.json()

            const users = data.users

            const listMessages = [
                `Estimado/a asegurado/a {ASEGURADO},

Le informamos que su receta N.º {RECETA} de la especialidad de {ESPECIALIDAD} se encuentra disponible en la Farmacia {FARMACION}, ubicada en {DIRECCION}.

La farmacia vecina lo atenderá los {DIAS} desde {HORAS}.

Acérquese lo antes posible para recoger los medicamentos. Recuerde que debe firmar el Boucher de recojo, revisar los medicamentos y, si tiene alguna observación, deberá informarla dentro de los 5 días como máximo después del recojo. Puede hacerlo llamando al (01) 350-0800, de lunes a domingo, de 8:00 am a 6:00 pm, incluyendo feriados.

Gracias.`
            ];


            for (const user of users) {
                const randomMessage = listMessages[Math.floor(Math.random() * listMessages.length)]
                await provider.sendMessage(user.number, randomMessage, {})
                await utils.delay(generateTimer(1000, 2000))
            }
        } catch (error) {
            console.log(`error al consultar informacion de los usuarios a notificar ${error}`)
        }
    });

}

main()
