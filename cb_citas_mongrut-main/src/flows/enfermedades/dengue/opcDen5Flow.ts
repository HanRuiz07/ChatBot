import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';
import { saveInformationToDatabase } from '~/services/postgresql';

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

import menuDengue from './menuDengue';
import denInacFlow from './denInacFlow';
import { crearMensaje } from '~/utils/utils';

dotenv.config();

const opcDen5Flow = addKeyword(EVENTS.LOCATION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer("Por favor, envíame tu *UBICACIÓN ACTUAL* 📍 para dirigirte al centro de *EsSalud más cercano* 🏥.",
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack, flowDynamic }) => {
            reset(ctx, gotoFlow, 300000);
            if (ctx.message.locationMessage) {
                const userLatitude = ctx.message.locationMessage.degreesLatitude;
                const userLongitude = ctx.message.locationMessage.degreesLongitude;
                await state.update({
                    latitud: userLatitude,
                    longitud: userLongitude
                });
                const myState = state.getMyState();
                await saveInformationToDatabase(myState.IdWhats, myState.latitud, 'latitud', state);
                await saveInformationToDatabase(myState.IdWhats, myState.longitud, 'longitud', state);

                if(myState.emergencia == undefined){
                    myState.emergencia = '0';
                }

                try {
                    const api = process.env.API;
                    const response = await fetch(api + '/citas/hospitales',
                        {
                            method: 'post',
                            body: JSON.stringify({
                                latitud: userLatitude,
                                longitud: userLongitude,
                                flujo: myState.emergencia,
                            }),
                            headers: { 'Content-Type': 'application/json' },
                        });
                        const data: any = await response.json();
                        const respuesta: any = crearMensaje(myState.IdWhats, state, data.body.resultado, data.body.flujo)
                        const recordatorio = '¡Protege a tus familiares y amigos! Reenvía este enlace para que también se hagan el autotest: http://www.essalud.gob.pe/whts/';
                        stop(ctx);
                        await flowDynamic(respuesta);
                        await flowDynamic(recordatorio);


                } catch (error) {
                    console.error(`Error al actualizar el estado: ${error}`);
                    stop(ctx);
                    await flowDynamic("Lo siento, no pude obtener la información de la ubicación. Por favor, inténtalo de nuevo.");
                    return gotoFlow(denInacFlow);

                }

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`);
                    const data: any = await response.json();
                    // Accede a las propiedades específicas directamente desde 'data.address'
                    const address = data.address;
                    await state.update({
                        distrito: address.suburb,
                        provincia: address.city,
                        departamento: address.state,
                        pais: address.country
                    });
                    const myState = state.getMyState();
                    await saveInformationToDatabase(myState.IdWhats, myState.distrito, 'distrito', state);
                    await saveInformationToDatabase(myState.IdWhats, myState.provincia, 'provincia', state);
                    await saveInformationToDatabase(myState.IdWhats, myState.departamento, 'departamento', state);
                    await saveInformationToDatabase(myState.IdWhats, myState.pais, 'pais', state);
                    console.log(`Ubicación del usuario ${myState.numbF}: ${myState.distrito}, ${myState.provincia}, ${myState.departamento}, ${myState.pais}`);
                } catch (error) {
                    console.error(`Error al obtener datos de la ubicacion : ${error}`);
                }
            } else {
                return fallBack("Para envíar tu *UBICACIÓN* 📍 dirígete al icono 📎 de tu WhatsApp, selecciona UBICACIÓN y marca UBICACIÓN ACTUAL o escriba *#* para salir al menu. ");
            }
        }
    )

export default opcDen5Flow