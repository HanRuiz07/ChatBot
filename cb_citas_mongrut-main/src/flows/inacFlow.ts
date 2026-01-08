import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';
import { saveOptionToDatabase } from '~/services/postgresql';

import menuFlow from './menuFlow';
import opc1Flow from './opc1Flow';
import opc2Flow from './opc2Flow';
import opc3Flow from './opc3Flow';
import opc4Flow from './opc4Flow';
import opc5Flow from './opc5Flow';
import menuEnfFlow from './enfermedades/menuEnfFlow';

const inacFlow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕',
            'Si termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.'
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, endFlow }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ userAnswer: ctx.body, });
            const myState = state.getMyState();
            switch (ctx.body) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opc1Flow);
                case '2':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opc2Flow);
                case '3':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opc3Flow);
                case '4':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opc4Flow);
                case '5':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(opc5Flow);
                case '6':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_menu', state);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return gotoFlow(menuEnfFlow);
                case 'F':
                case 'f':
                    stop(ctx);
                    console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer}`);
                    return endFlow('✨ "¡Gracias! Fue un placer ayudarte 😊" ✨');
                default:
                    stop(ctx);
                    console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                    return endFlow('❌ Opción no válida, por favor selecciona una opción válida.');
            }
        })

export default inacFlow