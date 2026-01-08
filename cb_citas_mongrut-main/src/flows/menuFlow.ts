import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';
import { saveOptionToDatabase } from '~/services/postgresql';

import opc1Flow from './opc1Flow';
import opc2Flow from './opc2Flow';
import opc3Flow from './opc3Flow';
import opc4Flow from './opc4Flow';
import opc5Flow from './opc5Flow';
import opc7Flow from './opc7Flow';
import menuEnfFlow from './enfermedades/menuEnfFlow';
import { cleanIcon, toLowerCaseAndRemoveAccents } from '~/utils/utils';

const menuFlow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '1️⃣ *¿Cómo cancelar tu cita?*',
            '2️⃣ *Conoce los servicios del Hospital Octavio Mongrut Muñoz*',
            '3️⃣ *Información sobre Trámites de Subsidio*',
            '4️⃣ *¿Quieres denunciar un presunto acto de corrupción?*',
            '5️⃣ *Libro de reclamaciones*',
            '6️⃣ *Información sobre enfermedades de riesgo*',
            '7️⃣ *Configurar notificaciones*'
        ]
    )
    
    .addAnswer(
        'Escribe el número 🔢 que desees seleccionar: 👇',
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 10000);
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            const mensaje = toLowerCaseAndRemoveAccents(myState.userAnswer);
            if (mensaje.includes('gracias')) {
                return fallBack(`¡Encantado de ayudarte! 😊\n\nPara obtener más información específica sobre el Hospital Octavio Mongrut Muñoz, solo elige una de las opciones del menú. ¡Estoy aquí para asistirte!`);
            }

            switch (myState.userAnswer) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc1Flow);
                case '2':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc2Flow);
                case '3':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc3Flow);
                case '4':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc4Flow);
                case '5':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc5Flow);
                case '6':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(menuEnfFlow);
                case '7':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    return gotoFlow(opc7Flow);
                default:
                    console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                    return fallBack('❌ Opción no válida, por favor escoga un número 🔢.');
            }
        }
    )


export default menuFlow