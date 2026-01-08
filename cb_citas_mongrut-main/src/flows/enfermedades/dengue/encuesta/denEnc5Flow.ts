import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, stop, reset } from '~/utils/idle-custom';
import { provider } from '../../../../provider'

import { saveOptionToDatabase, saveInformationToDatabase } from '~/services/postgresql';
import flujoTresFlow from './flujoTresFlow';

const auxEnc4 = {};

const denEnc5Flow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('🚨 ¡CUIDADO!, aún podría estar en peligro. Terminamos con las siguientes preguntas:')
    .addAction(async (ctx, { state }) => {
        const myState = state.getMyState();
        const number = myState.numbF;
        const values = [
            '1. ¿Sientes que te vas a desmayar o tu familiar está desmayado?',
            '2. ¿Tienes dificultad para respirar?',
            '3. ¿Tienes algún sangrado que no se detiene?',
            '4. ¿Tienes mucha sed y/o no has orinado?',
            '5. Ninguna',
        ];
        const enc4Msg1 = await provider.sendPoll(number, '(Puede elegir varios, pero seleccione de uno en uno)', { options: values, multiselect: true });
        await state.update({ enc4Msg1: enc4Msg1 });
    })
    .addAnswer(
        [],
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic, gotoFlow, endFlow }) => {
            reset(ctx, gotoFlow, 300000);
            const number = ctx.key.remoteJid
            const Enc4 = ctx.body;
            // Aquí puedes seguir utilizando auxEnf
            const values = [
                '1. ¿Sientes que te vas a desmayar o tu familiar está desmayado?',
                '2. ¿Tienes dificultad para respirar?',
                '3. ¿Tienes algún sangrado que no se detiene?',
                '4. ¿Tienes mucha sed y/o no has orinado?'
            ];
            // Verifica si la respuesta actual está dentro de las opciones permitidas antes de guardarla
            if (values.includes(Enc4)) {
                if (!Object.values(auxEnc4).includes(Enc4)) {
                    const answerKey = `resp${Object.keys(auxEnc4).length + 1}`;
                    auxEnc4[answerKey] = Enc4;
                }
            }
            const auxCount = Object.keys(auxEnc4).length;
            const myState = state.getMyState();

            if (auxCount == 0) {
                stop(ctx);
                saveInformationToDatabase(myState.IdWhats, '0', 'emergencia', state);
                await provider.vendor.sendMessage(number, { delete: myState.enc4Msg1.key })
                return endFlow('¡Gracias, por realizar la encuesta! No presentas signos de tener Dengue.');
            } else if (auxCount >= 1) {
                stop(ctx);
                await saveOptionToDatabase(myState.IdWhats, auxEnc4, 'encuesta4', state);
                await provider.vendor.sendMessage(number, { delete: myState.enc4Msg1.key })
                await flowDynamic('Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc4).join('\n'));
                return gotoFlow(flujoTresFlow);
            }

            switch (Enc4.toLowerCase()) {
                case 'ya':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, auxEnc4, 'encuesta4', state);
                    await provider.vendor.sendMessage(number, { delete: myState.enc4Msg1.key })
                    return endFlow('¡Gracias, por realizar la encuesta! No presentas signos de tener Dengue.');
                default: {
                    if (myState.enc4Msg2 && myState.enc4Msg3) {
                        await provider.vendor.sendMessage(number, { delete: myState.enc4Msg2.key })
                        await provider.vendor.sendMessage(number, { delete: myState.enc4Msg3.key })
                    }
                    const enc4Msg2 = await provider.vendor.sendMessage(number, { text: 'Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc4).join('\n') })
                    const enc4Msg3 = await provider.vendor.sendMessage(number, { text: "Puedes seguir seleccionando más opciones, pero si terminaste, escribe *\"Ya\"* para continuar." })
                    await state.update({ enc4Msg2: enc4Msg2, enc4Msg3: enc4Msg3 });
                    return fallBack('');
                }
            }
        }
    )

export default denEnc5Flow