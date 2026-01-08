import { addKeyword, EVENTS } from '@builderbot/bot'
import { provider } from '~/Prooverdor/provider';
import { start, reset, stop } from '~/utils/idle-custom';
import { saveOptionToDatabase } from '~/Servicios/postresql';

import Encuesta_Dengue_2 from './Encuesta_Dengue_2';
const auxEnc1 = {};

const Encuesta_Dengue_1 = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('Usted sufre de alguna de las siguientes enfermedades:')
    .addAction(async (ctx, { state }) => {
        const myState = state.getMyState();
        const number = myState.numbF;
        const values = [
            '1. Obesidad',
            '2. Presión alta',
            '3. Diabetes',
            '4. Enfermedad del corazón',
            '5. Cáncer',
            '6. Tiene diagnóstico de dengue',
            '7. Otra(s)',
            '8. Ninguna',
        ];
        const enc1Msg1 = await provider.sendPoll(number, '(Puede elegir varios, pero seleccione de uno en uno)', { options: values, multiselect: true });
        await state.update({ enc1Msg1: enc1Msg1 });
    })

    .addAnswer(
        [],
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic, gotoFlow }) => {
            reset(ctx, gotoFlow, 300000);
            const number = ctx.key.remoteJid
            const Enc1 = ctx.body;
            // Aquí puedes seguir utilizando auxEnf
            const values = [
                '1. Obesidad',
                '2. Presión alta',
                '3. Diabetes',
                '4. Enfermedad del corazón',
                '5. Cáncer',
                '6. Tiene diagnóstico de dengue',
                '7. Otra(s)',
            ];
            if (values.includes(Enc1)) {
                if (!Object.values(auxEnc1).includes(Enc1)) {
                    const answerKey = `resp${Object.keys(auxEnc1).length + 1}`;
                    auxEnc1[answerKey ] = Enc1 //No debería ser auxEnc[Object.keys(auxEnc1).length]?: no, son como diccionarios
                }
            }
            const auxCount = Object.keys(auxEnc1).length;
            const myState = state.getMyState();

            if (auxCount == 0) {
                stop(ctx);
                await provider.vendor.sendMessage(number, { delete: myState.enc1Msg1.key })
                return gotoFlow(Encuesta_Dengue_2);
            }

            switch (Enc1.toLowerCase()) {
                case 'ya':
                    await saveOptionToDatabase(myState.IdWhats, auxEnc1, 'encuesta1', state);
                    stop(ctx);
                    await provider.vendor.sendMessage(number, { delete: myState.enc1Msg1.key })
                    return gotoFlow(Encuesta_Dengue_2);
                default: {
                    if (myState.enc1Msg2 && myState.enc1Msg3) {
                        await provider.vendor.sendMessage(number, { delete: myState.enc1Msg2.key })
                        await provider.vendor.sendMessage(number, { delete: myState.enc1Msg3.key })
                    }
                    const enc1Msg2 = await provider.vendor.sendMessage(number, { text: 'Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc1).join('\n') })
                    const enc1Msg3 = await provider.vendor.sendMessage(number, { text: "Puedes seguir seleccionando más opciones, pero si terminaste, escribe *\"Ya\"* para continuar." })
                    await state.update({ enc1Msg2: enc1Msg2, enc1Msg3: enc1Msg3 });
                    return fallBack('');
                }

            }
        }
    )


export default Encuesta_Dengue_1