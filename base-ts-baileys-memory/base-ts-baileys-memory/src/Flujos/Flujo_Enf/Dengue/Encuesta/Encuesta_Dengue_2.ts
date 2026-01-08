import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

import Encuesta_Dengue_3 from './Encuesta_Dengue_3';
import Dengue_1 from './Dengue_1';
import { saveInformationToDatabase } from '~/Servicios/postresql';
import { toLowerCaseAndRemoveAccents } from '~/utils/utils';

const Encuesta_Dengue_2 = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '¿Tiene fiebre?',
            '1️⃣ *Si*',
            '2️⃣ *No*',
        ],
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic, gotoFlow }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ fiebre: ctx.body });
            const myState = state.getMyState();
            if (myState.fiebre == '1' || toLowerCaseAndRemoveAccents(myState.fiebre) == 'si') {
                console.log(`El usuario ${myState.numbF} puso en fiebre: ${ctx.body}`);
                await saveInformationToDatabase(myState.IdWhats, 'si', 'fiebre', state);
            } else if (myState.fiebre == '2' || toLowerCaseAndRemoveAccents(myState.fiebre) == 'no') {
                console.log(`El usuario ${myState.numbF} puso en fiebre: ${ctx.body}`);
                await saveInformationToDatabase(myState.IdWhats, 'no', 'fiebre', state);
                return gotoFlow(Encuesta_Dengue_3);
            } else {
                return fallBack('❌ Por favor, selecciona una opción válida.');
            }
        }
    )

    .addAnswer('¿Cuántos días de fiebre tienes?',
        { capture: true },
        async (ctx, { state, fallBack, gotoFlow }) => {
            reset(ctx, gotoFlow, 300000);
            const diasFiebre = parseInt(ctx.body);
            if (isNaN(diasFiebre)) {
                return fallBack("La respuesta debe ser un número.");
            }

            if (diasFiebre >= 1 || diasFiebre <= 15) {
                await state.update({ diasFiebre: ctx.body });
                const myState = state.getMyState();
                console.log(`El usuario ${myState.numbF} tiene ${myState.diasFiebre} dias de fiebre`);
                await saveInformationToDatabase(myState.IdWhats, myState.diasFiebre, 'dias', state);
                if (myState.edad <= 12 && myState.diasFiebre > 3) {
                    console.log(`El usuario ${myState.numbF} sera digirido al flujo uno`);
                    stop(ctx);
                    return gotoFlow(Dengue_1);
                }
                return gotoFlow(Encuesta_Dengue_3);
            } else {
                return fallBack("La respuesta debe estar entre 1 y 15 días.");
            }
        }
    )

export default Encuesta_Dengue_2