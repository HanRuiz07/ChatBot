import { addKeyword, EVENTS, utils } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

import inacFlow from './inacFlow'
import { saveOptionToDatabase } from '~/services/postgresql';
import menuFlow from './menuFlow';

const opc2Flow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '🏥 *Servicios Médicos Disponibles en el Hospital Octavio Mongrut Muñoz*:',
            '',
            '1️⃣ *Atención General y Medicina Preventiva*',
            '2️⃣ *Especialidades Médicas*',
            '3️⃣ *Atención de Salud Física y Rehabilitación* ',
            '4️⃣ *Servicios de Cirugía y Atención Especializada*',
            '5️⃣ *Especialidades de Apoyo y Bienestar*',
            '#️⃣ *Menu Principal* 🏠',
            '',
            '👉 *Selecciona un número para ver la lista completa.*',
        ]
    )

    .addAnswer(null,
        { capture: true },
        async (ctx, { state, flowDynamic, fallBack, gotoFlow, endFlow }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ userAnswer: ctx.body, });
            const myState = state.getMyState();
            switch (myState.userAnswer) {
                case '1':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_servicios', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    await flowDynamic('✳️ Medicina General\n✳️ Ginecología Quirúrgica\n✳️ Pediatría\n✳️ Enfermería\n✳️ Psicología\n✳️ Nutrición\n✳️ Odontología\n✳️ Obstetricia');
                    await flowDynamic('📅 Para solicitar una cita con un especialista, ingresa a: https://miconsulta.essalud.gob.pe/');
                    await flowDynamic('👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕\nSi termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.')
                    return fallBack();
                case '2':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_servicios', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    await flowDynamic('✳️ Anestesiología\n✳️ Cardiología\n✳️ Dermatología\n✳️ Endocrinología\n✳️ Gastroenterología\n✳️ Geriatría\n✳️ Neumología\n✳️ Medicina Interna\n✳️ Urología Quirúrgica');
                    await flowDynamic('📅 Para solicitar una cita con un especialista, ingresa a: https://miconsulta.essalud.gob.pe/');
                    await flowDynamic('👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕\nSi termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.')
                    return fallBack();
                case '3':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_servicios', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    await flowDynamic('✳️ Medicina Física y Rehabilitación\n✳️ Tecnólogo en Terapia Física');
                    await flowDynamic('📅 Para solicitar una cita con un especialista, ingresa a: https://miconsulta.essalud.gob.pe/');
                    await flowDynamic('👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕\nSi termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.')
                    return fallBack();
                case '4':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_servicios', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    await flowDynamic('✳️ Cirugía General\n✳️ Oftalmología\n✳️ Ortopedia y Traumatología\n✳️ Otorrinolaringología');
                    await flowDynamic('📅 Para solicitar una cita con un especialista, ingresa a: https://miconsulta.essalud.gob.pe/');
                    await flowDynamic('👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕\nSi termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.')
                    return fallBack();
                case '5':
                    stop(ctx);
                    await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_servicios', state);
                    console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                    await flowDynamic('✳️ Radiología\n✳️ Radiodiagnóstico\n✳️ Laboratorio');
                    await flowDynamic('📅 Para solicitar una cita con un especialista, ingresa a: https://miconsulta.essalud.gob.pe/');
                    await flowDynamic('👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕\nSi termino tu consulta escribe "F" y si deseas continuar ingresa uno de los *números* 🔢  disponibles dentro del menú.')
                    return fallBack()
                case '#':
                    stop(ctx);
                    return gotoFlow(menuFlow);
                case 'F':
                case 'f':
                    stop(ctx);
                    console.log(`El usuario ${myState.numbF} termino la sesión`);
                    return endFlow('✨ "¡Gracias! Fue un placer ayudarte 😊" ✨');
                default:
                    console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                    return fallBack('❌ Opción no válida, por favor escoga un número 🔢.');
            }
        }

    )

export default opc2Flow