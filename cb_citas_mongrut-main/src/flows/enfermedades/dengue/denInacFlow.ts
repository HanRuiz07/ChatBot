import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

import menuFlow from './menuDengue';
import opcDen1Flow from './opcDen1Flow';
import opcDen2Flow from './opcDen2Flow';
import opcDen3Flow from './opcDen3Flow';
import opcDen4Flow from './opcDen4Flow';
import opcDen5Flow from './opcDen5Flow';
import { saveOptionToDatabase } from '~/services/postgresql';
import { cleanIcon } from '~/utils/utils';

const denInacFlow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕',
            'Si termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.'
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, endFlow }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ userAnswer: cleanIcon(ctx.body), });
            const myState = state.getMyState();
            console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
            switch (ctx.body) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opcDen1Flow);
                case '2':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opcDen2Flow);
                case '3':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opcDen3Flow);
                case '4':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opcDen4Flow);
                case '5':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opcDen5Flow);
                case '#':
                    stop(ctx);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(menuFlow);
                case 'F':
                    stop(ctx);
                    console.log(`El usuario seleccionó la opción: ${myState.userAnswer}`);
                    return endFlow('✨ "¡Gracias! Fue un placer ayudarte 😊" ✨');
                default:
                    stop(ctx);
                    console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                    return endFlow('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        })

export default denInacFlow