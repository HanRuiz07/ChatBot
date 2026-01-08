import { addKeyword, EVENTS } from '@builderbot/bot'

import opcVir1Flow from './opcVir1Flow';
import opcVir2Flow from './opcVir2Flow';
import opcVir3Flow from './opcVir7Flow';
import opcVir4Flow from './opcVir4Flow';
import opcVir5Flow from './opcVir5Flow';
import opcVir6Flow from './opcVir6Flow';
import opcVir7Flow from './opcVir7Flow';
import opcVir8Flow from './opcVir8Flow';
import menuEnfFlow from '../menuEnfFlow';
import { cleanIcon } from '~/utils/utils';

const menuViruela = addKeyword(EVENTS.ACTION)

    .addAnswer(
        [
            '1️⃣ ¿Qué es la MPOX (viruela símica)? 🐒',
            '2️⃣ ¿Cómo se transmite la MPOX (viruela símica)? 🤝',
            '3️⃣ ¿Cómo prevenir la MPOX (viruela símica)? 🛡️',
            '4️⃣ ¿Cuáles son los síntomas de la MPOX (viruela símica)? 🤒',
            '5️⃣ ¿Cómo se diagnostica la MPOX (viruela símica)? 🧪',
            '6️⃣ ¿Qué hacer si sospecho que tengo síntomas compatibles con MPOX (viruela símica)? 🚑',
            '7️⃣ ¿Por qué se ha declarado la alerta epidemiológica por la MPOX (viruela símica)? ⚠️',
            '8️⃣ ¿Existe una vacuna contra la MPOX (viruela símica)? 🏥',
            '9️⃣ *Menu Principal* 🏠',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
            switch (myState.userAnswer) {
                case '1':
                    return gotoFlow(opcVir1Flow);
                case '2':
                    return gotoFlow(opcVir2Flow);
                case '3':
                    return gotoFlow(opcVir3Flow);
                case '4':
                    return gotoFlow(opcVir4Flow);
                case '5':
                    return gotoFlow(opcVir5Flow);
                case '6':
                    return gotoFlow(opcVir6Flow);
                case '7':
                    return gotoFlow(opcVir7Flow);
                case '8':
                    return gotoFlow(opcVir8Flow);
                case '9':
                    return gotoFlow(menuEnfFlow);
                default:
                    return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        })

export default menuViruela