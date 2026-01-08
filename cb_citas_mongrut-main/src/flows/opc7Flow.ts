import { addKeyword, EVENTS } from '@builderbot/bot'
import { saveOptionToDatabase } from '~/services/postgresql';
import { start, reset, stop } from '~/utils/idle-custom';

import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config();
import menuFlow from './menuFlow';
import { cleanIcon, toLowerCaseAndRemoveAccents } from '~/utils/utils';

const opc7Flow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('¿Desea seguir recibiendo notificaciones de su cita?')
    .addAnswer(
        [
            '1️⃣ *Si*',
            '2️⃣ *No*',
            '#️⃣ *Menu Principal* 🏠',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack, endFlow }) => {
            reset(ctx, gotoFlow, 300000)
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`);
            switch (toLowerCaseAndRemoveAccents(myState.userAnswer)) {
                case '1':
                case 'si':
                    stop(ctx);
                    try {
                        const response: any = await fetch(process.env.API + '/citas/notificacion',
                            {
                                method: 'post',
                                body: JSON.stringify({
                                    numero: myState.numbF.slice(2),
                                    condicion: true,
                                }),
                                headers: { 'Content-Type': 'application/json' },
                            });
                        const data = await response.json();
                        if (data.error == true) {
                            console.log(data.body)
                            return endFlow('❌ Usted no esta registrado en el sistema de notificaciones, por favor intenta nuevamente.')  
                        } else {
                            console.log(`El usuario ${myState.numbF} ha activado las notificaciones`)
                            await saveOptionToDatabase(myState.IdWhats, 'si', 'mensaje_notificaciones', myState);
                            return endFlow('✅ Notificaciones activadas correctamente.')
                        }
                    } catch (err) {
                        console.log(err)
                        return endFlow('❌ No se pudo configurar la notificación, por favor intenta nuevamente.')
                    }
                case '2':
                case 'no':
                    stop(ctx);
                    try {
                        const response: any = await fetch(process.env.API + '/citas/notificacion',
                            {
                                method: 'post',
                                body: JSON.stringify({
                                    numero: myState.numbF.slice(2),
                                    condicion: false,
                                }),
                                headers: { 'Content-Type': 'application/json' },
                            });
                        const data = await response.json();
                        if (data.error == true) {
                            console.log(data.body)
                            return endFlow('❌ Usted no esta registrado en el sistema de notificaciones, por favor intenta nuevamente.')  
                        } else {
                            console.log(`El usuario ${myState.numbF} ha desactivado las notificaciones`)
                            await saveOptionToDatabase(myState.IdWhats, 'no', 'mensaje_notificaciones', myState);
                            return endFlow('✅ Notificaciones desactivadas correctamente.')
                        }
                    } catch (err) {
                        console.log(err)
                        return endFlow('❌ No se pudo configurar la notificación, por favor intenta nuevamente.')
                    }
                case '#':
                    stop(ctx);
                    return gotoFlow(menuFlow);
                default:
                    return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        })

export default opc7Flow