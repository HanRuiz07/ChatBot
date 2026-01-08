import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';
import { saveOptionToDatabase } from '~/services/postgresql';
import fetch from 'node-fetch';

import menuFlow from '../menuFlow';
import menuViruela from './viruela/menuViruela';
import menuDengue from './dengue/menuDengue';
import { cleanIcon } from '~/utils/utils';

const menuEnfFlow = addKeyword(EVENTS.ACTION)
    
    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('*❓🩺 ¿Sobre qué enfermedad quieres saber?*')
    .addAnswer(
        [
            //'1️⃣2️⃣ *MPOX (Viruela símica)* 🐵🦟',
            '1️⃣ *Dengue*',
            '#️⃣ *Menu Principal* 🏠',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000)
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`);
            switch (myState.userAnswer) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_enfermedades', myState);
                    return gotoFlow(menuDengue);
                // case '2':
                //     stop(ctx);
                //     return gotoFlow(menuDengue);
                case '#':
                    stop(ctx);
                    return gotoFlow(menuFlow);
                default:
                    return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        })

export default menuEnfFlow