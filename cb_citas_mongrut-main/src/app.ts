import { createBot, MemoryDB } from '@builderbot/bot'
import { schedule } from 'node-cron'
import { provider } from './provider'
import { join } from 'path' 

import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

import flow from './flows'
import { conPostgres } from './services/postgresql'

dotenv.config();

const PORT = process.env.PORT

const main = async () => {

    conPostgres();

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB,
        provider,
        flow
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

    //Generar reporte de citas de 1 y 5 dias
    schedule('0 7 * * *', async () => {
        console.log('Generando reporte de citas...');
        const api = process.env.API;

        try {
            const response: any = await fetch(api + '/registros/generar', {
                method: 'GET', // Cambiado a GET
                headers: { 'Content-Type': 'application/json' },
            });

            // Verifica si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            // Asegúrate de que el servidor está devolviendo JSON
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                // Maneja la estructura esperada de la respuesta
                if (!data.error && data.status === 200) {
                    console.log(data.body); // "Registros Creados"
                } else {
                    console.error('Error en la respuesta de la API:', data);
                }
            } else {
                throw new Error('La respuesta no es JSON.');
            }
        } catch (err) {
            console.error('Error al generar el reporte:', err);
        }
    });

    //Enviar encuesta de satisfaccion un dia despues de la cita
    schedule('* 13-23 * * *', async () => {
        console.log('enviando encuesta de satisfaccion...')
        const api = process.env.API;
        try {
            const response: any = await fetch(api + '/citas/consultar',
                {
                    method: 'post',
                    body: JSON.stringify({
                        codses: 412,
                        condicion: -1
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
            const data = await response.json();
            if (data.error == true) {
                console.log(data.body)
            } else {
                const users = data.body
                const listMessages = [
                    `Hola, {PACIENTE}

Queremos conocer tu opinión sobre la atención recibida en tu cita en el Centro de EsSalud el dia de ayer, te hemos enviado una encuesta para que valores tu experiencia.

Recuerda que esta información nos ayudará mejorar nuestros servicios. `
                ];
                let aux = 0;
                for (const user of users) {
                    if (aux >= 1) break;
                    const onWhats = await provider.vendor.onWhatsApp('51' + user.TEL_MOVIL)
                    if (onWhats[0]?.exists) {
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} esta en linea`)
                        const randomMessage = listMessages[Math.floor(Math.random() * listMessages.length)]
                        const message = randomMessage
                            .replace('{PACIENTE}', user.PACIENTE.split(' ')[user.PACIENTE.split(' ').length - 1])
                        await provider.sendMessage('51' + user.TEL_MOVIL, message, {})
                        const mjg: any = await provider.sendPoll('51' + user.TEL_MOVIL, 'Seleccione una opción', { options: ['Excelente', 'Bueno', 'Regular', 'Malo', 'Muy malo'], multiselect: true });
                        const key = mjg.key;
                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true,
                                        antelacion: -1,
                                        key: key
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`se envio el mensaje de satisfaccion al usuario: ${user.TEL_MOVIL}`)
                                aux++;
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} no esta en linea`)
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: false,
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`no se envio el mensaje de satisfaccion al usuario: ${user.TEL_MOVIL}`)
                            }
                        } catch (err) {
                            console.log(err)
                        }

                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: null,
                                        antelacion: -1
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    await utils.delay(5000)
                }
            }
        } catch (err) {
            console.log(err)
        }
    })

    //Enviar recordatorios de citas faltando 1 dia  
    schedule('* 13-23 * * *', async () => {
        console.log('enviando recordatorios de citas faltando 1 dia...')
        const api = process.env.API;
        try {
            const response: any = await fetch(api + '/citas/consultar',
                {
                    method: 'post',
                    body: JSON.stringify({
                        codses: 412,
                        condicion: 1
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
            const data = await response.json();
            if (data.error == true) {
                console.log(data.body)
            } else {
                const users = data.body
                const listMessages = [
                    `*¡Recuerda que mañana es tu cita en EsSalud!*

¡Hola, {PACIENTE}!
Te recordamos los detalles de tu cita:
📅 Día: {FECHA_CITA}
⏰ Hora: {HORA_CITA}
📑 Especialidad: {SERVICIO}
👨‍⚕️ Médico: {PROFESIONAL}
🏥 IPRESS: {CENTRO}
📍 Ubicación: {UBICACION}

No te olvides llegar *30 minutos* antes de la hora de tu cita.
Escribe *Hola* para darte mayor información:`
                ];
                let aux = 0;
                for (const user of users) {
                    if (aux >= 1) break;
                    const onWhats = await provider.vendor.onWhatsApp('51' + user.TEL_MOVIL)
                    if (onWhats[0]?.exists) {
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} esta en linea`)
                        const randomMessage = listMessages[Math.floor(Math.random() * listMessages.length)]
                        const message = randomMessage
                            .replace('{PACIENTE}', user.PACIENTE.split(' ')[user.PACIENTE.split(' ').length - 1])
                            .replace('{FECHA_CITA}', user.FECHA_CITA)
                            .replace('{HORA_CITA}', user.HORA_CITA)
                            .replace('{SERVICIO}', user.SERVICIO)
                            .replace('{PROFESIONAL}', user.PROFESIONAL)
                            .replace('{CENTRO}', user.CENTRO)
                            .replace('{UBICACION}', user.ENLACE)
                        await provider.sendMessage('51' + user.TEL_MOVIL, message, { media: join(process.cwd(), 'assets', 'sample01.jpg') })
                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`se envio el mensaje de 1 dia al usuario: ${user.TEL_MOVIL}`)
                                aux++;
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} no esta en linea`)
                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: null
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: false
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`no se envio el mensaje de 1 dia al usuario: ${user.TEL_MOVIL}`)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    await utils.delay(5000)
                }
            }
        }
        catch (err) {
            //await provider.sendMessage('51943730896', err.message, {})
            console.log(err)
        }

    });

    //Enviar recordatorios de citas faltando 5 dia
    schedule('* 13-23 * * *', async () => {
        console.log('enviando recordatorios de citas faltando 5 dias...')
        const api = process.env.API;
        try {
            const response: any = await fetch(api + '/citas/consultar',
                {
                    method: 'post',
                    body: JSON.stringify({
                        codses: 412,
                        condicion: 5
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
            const data = await response.json();
            if (data.error == true) {
                console.log(data.body)
            } else {
                const users = data.body
                const listMessages =
                    [
                        `¡Faltan *5 días* para tu cita!

¡Hola, {PACIENTE}!
Te recordamos los detalles de tu cita:
📅 Día: {FECHA_CITA}
⏰ Hora: {HORA_CITA}
📑 Especialidad: {SERVICIO}
👨‍⚕️ Médico: {PROFESIONAL}
🏥 IPRESS: {CENTRO}
📍 Ubicación: {UBICACION}

Si no has agendado una cita en EsSalud, por favor responde *NO* a este mensaje para que podamos actualizar nuestros registros.

Escribe *Hola* para darte mayor información:`,
                    ];
                let aux = 0;
                for (const user of users) {
                    if (aux >= 1) break;
                    const onWhats = await provider.vendor.onWhatsApp('51' + user.TEL_MOVIL)
                    if (onWhats[0]?.exists) {
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} esta en linea`)
                        const randomMessage = listMessages[Math.floor(Math.random() * listMessages.length)]
                        const message = randomMessage
                            .replace('{PACIENTE}', user.PACIENTE.split(' ')[user.PACIENTE.split(' ').length - 1])
                            .replace('{FECHA_CITA}', user.FECHA_CITA)
                            .replace('{HORA_CITA}', user.HORA_CITA)
                            .replace('{SERVICIO}', user.SERVICIO)
                            .replace('{PROFESIONAL}', user.PROFESIONAL)
                            .replace('{CENTRO}', user.CENTRO)
                            .replace('{UBICACION}', user.ENLACE)
                        await provider.sendMessage('51' + user.TEL_MOVIL, message, {})
                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: true
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`se envio el mensaje de 5 dias al usuario: ${user.TEL_MOVIL}`)
                                aux++;
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        console.log(`el usuario con telefono: ${user.TEL_MOVIL} no esta en linea`)
                        try {
                            const response: any = await fetch(api + '/citas/estado',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: null
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        try {
                            const response: any = await fetch(api + '/citas/whatsapp',
                                {
                                    method: 'post',
                                    body: JSON.stringify({
                                        id: user.id,
                                        condicion: false
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            const data = await response.json();
                            if (data.error == true) {
                                console.log(data.body)
                            } else {
                                console.log(`no se envio el mensaje de 5 dias al usuario: ${user.TEL_MOVIL}`)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    await utils.delay(5000)
                }
            }
        }
        catch (err) {
            //await provider.sendMessage('51943730896', err.message, {})
            console.log(err)
        }

    });

}

main()
