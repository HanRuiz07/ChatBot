import { addKeyword, EVENTS } from '@builderbot/bot'
import { provider } from '../../../../provider'
import { saveOptionToDatabase } from '~/services/postgresql';
import { start, reset, stop } from '~/utils/idle-custom';

import denEnc4Flow from './denEnc4Flow';
import flujoUnoFlow from './flujoUnoFlow';

const auxEnc2 = {};

const denEnc3Flow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('🚨 ¡CUIDADO!, aún podría estar en peligro. Terminamos con las siguie    ntes preguntas:')
    .addAction(async (ctx, { state }) => {
        const myState = state.getMyState();
        const number = myState.numbF;
        const values = [
            '1. Dolor de cabeza',
            '2. Dolor de cuerpo',
            '3. Dolor de huesos',
            '4. Dolor de ojos',
            '5. Náuseas y/o vómitos',
            '6. Manchas rojas en el cuerpo',
            '7. Ninguna',
        ];
        const enc2Msg1 = await provider.sendPoll(number, '(Puede elegir varios, pero seleccione de uno en uno)', { options: values, multiselect: true });
        await state.update({ enc2Msg1: enc2Msg1 });
    })
    .addAnswer(
        [],
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic, gotoFlow }) => {
            reset(ctx, gotoFlow, 300000);
            const number = ctx.key.remoteJid
            const Enc2 = ctx.body;
            // Aquí puedes seguir utilizando auxEnf
            const values = [
                '1. Dolor de cabeza',
                '2. Dolor de cuerpo',
                '3. Dolor de huesos',
                '4. Dolor de ojos',
                '5. Náuseas y/o vómitos',
                '6. Manchas rojas en el cuerpo'
            ];
            // Verifica si la respuesta actual está dentro de las opciones permitidas antes de guardarla
            if (values.includes(Enc2)) {
                if (!Object.values(auxEnc2).includes(Enc2)) {
                    const answerKey = `resp${Object.keys(auxEnc2).length + 1}`;
                    auxEnc2[answerKey] = Enc2;
                }
            }
            const auxCount = Object.keys(auxEnc2).length;
            const myState = state.getMyState();

            if (auxCount == 0) {
                stop(ctx);
                await provider.vendor.sendMessage(number, { delete: myState.enc2Msg1.key })
                return gotoFlow(denEnc4Flow);
            } else if (auxCount >= 2 && myState.fiebre == '1') {
                stop(ctx);
                await saveOptionToDatabase(myState.IdWhats, auxEnc2, 'encuesta2', state);
                await provider.vendor.sendMessage(number, { delete: myState.enc2Msg1.key })
                await flowDynamic('Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc2).join('\n'));
                return gotoFlow(flujoUnoFlow);
            }

            switch (Enc2.toLowerCase()) {
                case 'ya':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, auxEnc2, 'encuesta2', state);
                    await provider.vendor.sendMessage(number, { delete: myState.enc2Msg1.key })
                    return gotoFlow(denEnc4Flow);
                default: {
                    if (myState.enc2Msg2 && myState.enc2Msg3) {
                        await provider.vendor.sendMessage(number, { delete: myState.enc2Msg2.key })
                        await provider.vendor.sendMessage(number, { delete: myState.enc2Msg3.key })
                    }
                    const enc2Msg2 = await provider.vendor.sendMessage(number, { text: 'Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc2).join('\n') })
                    const enc2Msg3 = await provider.vendor.sendMessage(number, { text: "Puedes seguir seleccionando más opciones, pero si terminaste, escribe *\"Ya\"* para continuar." })
                    await state.update({ enc2Msg2: enc2Msg2, enc2Msg3: enc2Msg3 });
                    return fallBack('');
                }
            }
        }
    )

export default denEnc3Flow