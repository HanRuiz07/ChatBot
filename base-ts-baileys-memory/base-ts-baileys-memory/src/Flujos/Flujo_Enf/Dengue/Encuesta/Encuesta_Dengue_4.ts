import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, stop, reset } from '~/utils/idle-custom';
import { provider } from '~/Prooverdor/provider';
import { saveOptionToDatabase } from '~/Servicios/postresql';
import Dengue_2 from './Dengue_2';
import Encuesta_Dengue_5 from './Encuesta_Dengue_5';

const auxEnc3 = {};

const Encuesta_Dengue_4 = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer('🚨 ¡CUIDADO!, aún podría estar en peligro. Terminamos con las siguientes preguntas:')
    .addAction(async (ctx, { state }) => {
        const myState = state.getMyState();
        const number = myState.numbF;
        const values = [
            '1. ¿Tienes dolor abdominal intenso y continuo o dolor al presionar tu abdomen?',
            '2. ¿Sufres de vómitos a repetición?',
            '3. ¿Tienes hinchazón del abdomen o de tus piernas?',
            '4. ¿Has tenido sangrado de la boca o nariz?',
            '5. ¿Te sientes con sueño o desorientado?',
            '6. ¿Has sentido sensación de desmayo (presión baja)?',
            '7. ¿Tienes dolor por debajo de las costillas del lado derecho?',
            '8. Ninguna',
        ];
        const enc3Msg1 = await provider.sendPoll(number, '(Puede elegir varios, pero seleccione de uno en uno)', { options: values, multiselect: true });
        await state.update({ enc3Msg1: enc3Msg1 });
    })
    .addAnswer(
        [],
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic, gotoFlow }) => {
            reset(ctx, gotoFlow, 300000);
            const number = ctx.key.remoteJid
            const Enc3 = ctx.body;
            // Aquí puedes seguir utilizando auxEnf
            const values = [
                '1. ¿Tienes dolor abdominal intenso y continuo o dolor al presionar tu abdomen?',
                '2. ¿Sufres de vómitos a repetición?',
                '3. ¿Tienes hinchazón del abdomen o de tus piernas?',
                '4. ¿Has tenido sangrado de la boca o nariz?',
                '5. ¿Te sientes con sueño o desorientado?',
                '6. ¿Has sentido sensación de desmayo (presión baja)?',
                '7. ¿Tienes dolor por debajo de las costillas del lado derecho?'
            ];
            // Verifica si la respuesta actual está dentro de las opciones permitidas antes de guardarla
            if (values.includes(Enc3)) {
                if (!Object.values(auxEnc3).includes(Enc3)) {
                    const answerKey = `resp${Object.keys(auxEnc3).length + 1}`;
                    auxEnc3[answerKey] = Enc3;
                }
            }
            const auxCount = Object.keys(auxEnc3).length;
            const myState = state.getMyState();

            if (auxCount == 0) {
                stop(ctx);
                await provider.vendor.sendMessage(number, { delete: myState.enc3Msg1.key })
                return gotoFlow(Encuesta_Dengue_5);
            } else if (auxCount >= 1) {
                stop(ctx);
                await saveOptionToDatabase(myState.IdWhats, auxEnc3, 'encuesta3', state);
                await provider.vendor.sendMessage(number, { delete: myState.enc3Msg1.key })
                await flowDynamic('Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc3).join('\n'));
                return gotoFlow(Dengue_2);
            }

            switch (Enc3.toLowerCase()) {
                case 'ya':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, auxEnc3, 'encuesta3', state);
                    await provider.vendor.sendMessage(number, { delete: myState.enc3Msg1.key })
                    return gotoFlow(Encuesta_Dengue_4);
                default: {
                    if (myState.enc3Msg2 && myState.enc3Msg3) {
                        await provider.vendor.sendMessage(number, { delete: myState.enc3Msg2.key })
                        await provider.vendor.sendMessage(number, { delete: myState.enc3Msg3.key })
                    }
                    const enc3Msg2 = await provider.vendor.sendMessage(number, { text: 'Has seleccionado las siguientes opciones:\n' + Object.values(auxEnc3).join('\n') })
                    const enc3Msg3 = await provider.vendor.sendMessage(number, { text: "Puedes seguir seleccionando más opciones, pero si terminaste, escribe *\"Ya\"* para continuar." })
                    await state.update({ enc3Msg2: enc3Msg2, enc3Msg3: enc3Msg3 });
                    return fallBack('');
                }
            }
        }
    )

export default Encuesta_Dengue_4