import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

import menuEnfFlow from '../menuEnfFlow';

import opcDen1Flow from './opcDen1Flow';
import opcDen2Flow from './opcDen2Flow';
import opcDen3Flow from './opcDen3Flow';
import opcDen4Flow from './opcDen4Flow';
import opcDen5Flow from './opcDen5Flow';
import { saveOptionToDatabase } from '~/services/postgresql';
import { cleanIcon } from '~/utils/utils';

const menuDengue = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '1️⃣ ¿Qué es el Dengue? 🦟',
            '2️⃣ ¿Cómo se transmite el dengue? 🤝',
            '3️⃣ ¿Cómo prevenir el dengue? 🛡️',
            '4️⃣ *Quiero saber si tengo dengue.* 🤒',
            '5️⃣ *Ver centros de EsSalud cercanos.* 🏥',
            '#️⃣ *Menu Principal* 🏠',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);

            switch (myState.userAnswer) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    return gotoFlow(opcDen1Flow);
                case '2':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    return gotoFlow(opcDen2Flow);
                case '3':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    return gotoFlow(opcDen3Flow);
                case '4':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    return gotoFlow(opcDen4Flow);
                case '5':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    return gotoFlow(opcDen5Flow);
                case '#':
                    stop(ctx);
                    return gotoFlow(menuEnfFlow);
                default:
                    return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        }
    )

export default menuDengue