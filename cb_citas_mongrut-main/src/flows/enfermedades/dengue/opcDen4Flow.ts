import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';


import denEnc1Flow from './encuesta/denEnc1Flow'
import { saveInformationToDatabase } from '~/services/postgresql';
import { cleanIcon } from '~/utils/utils';

const opcDen4Flow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 300000))
    .addAnswer(
        [
            '🚨 ¡RECUERDA QUE TU *SALUD* ES LO MÁS *IMPORTANTE*! 🤒',
            '⏳ Tómate el *tiempo* necesario para completar la *encuesta* ⌛',
            '',
            '¡Comencemos!, pero antes escribe tus *NOMBRES Y APELLIDOS*, por favor:'
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ nombre: cleanIcon(ctx.body) });
            const myState = state.getMyState();
            const palabras = myState.nombre.trim().split(/\s+/);
            // Asegurarse de que hay al menos dos palabras y que la primera palabra tiene al menos 3 letras
            if (palabras.length < 2 || palabras[0].length < 3) {
                return fallBack("El nombre o apellido no es válido.");
            }
            // Verificar que las palabras subsiguientes tengan al menos 2 letras
            for (let i = 1; i < palabras.length; i++) {
                if (palabras[i].length < 2) {
                    return fallBack("Cada palabra del nombre, después de la primera, debe tener al menos 2 letras.");
                }
            }
            console.log(`El usuario ingresó: ${myState.nombre}`);
            await saveInformationToDatabase(myState.IdWhats, myState.nombre, 'nombre', state);
        })

    .addAnswer(
        [
            '¿Eres hombre o mujer?',
            '1️⃣ Hombre',
            '2️⃣ Mujer',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ genero: cleanIcon(ctx.body) });
            const myState = state.getMyState();
            if (myState.genero !== '1' && myState.genero !== '2') {
                return fallBack("Por favor, selecciona una opción válida.");
            }
            console.log("genero:", myState.genero)
            await saveInformationToDatabase(myState.IdWhats, myState.genero, 'sexo', state);
        })

    .addAnswer('Gracias. Ahora, por favor, también escribe tu DNI.',
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ dni: cleanIcon(ctx.body) });
            const myState = state.getMyState();
            const dni = myState.dni.trim();
            // Verificar si la entrada contiene solo números
            if (!/^\d+$/.test(myState.dni)) {
                return fallBack("El DNI debe contener solo números.");
            }
            if (dni.length == 8) {
                // Verificar si todos los dígitos son iguales
                const consecutivo = /12345678|23456789|34567890|67890123|78901234|89012345|90123456|87654321|98765432|10987654|54321098|65432109/.test(myState.dni);
                if (consecutivo) {
                    return fallBack("El DNI no puede tener todos los dígitos iguales.");
                } else {
                    console.log(`dni: ${myState.dni}`);
                    await saveInformationToDatabase(myState.IdWhats, myState.dni, 'dni', state);
                }
            } else {
                return fallBack("El DNI debe tener exactamente 8 dígitos.");
            }

        })

    .addAnswer('¿Cuantos años cumplidos tienes?',
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ edad: cleanIcon(ctx.body) });
            const myState = state.getMyState();
            const edad = parseInt(myState.edad);
            if (isNaN(edad)) {
                return fallBack("La edad debe ser un número.");
            }
            if (edad < 1 || edad > 100) {
                return fallBack("La edad debe estar entre 1 y 100 años.");
            } else {
                console.log(`edad: ${myState.edad}`);
                await saveInformationToDatabase(myState.IdWhats, myState.edad, 'edad', state);
                if (myState.genero === '1') {
                    stop(ctx);
                    return gotoFlow(denEnc1Flow)
                }
            }
        })

    .addAnswer(
        [
            '¿Usted está embarazada?',
            '1️⃣ Si',
            '2️⃣ No',
        ],
        { capture: true },
        async (ctx, { state, gotoFlow, fallBack }) => {
            reset(ctx, gotoFlow, 300000);
            await state.update({ embarazada: cleanIcon(ctx.body) });
            const myState = state.getMyState();
            if (myState.embarazada !== '1' && myState.embarazada !== '2') {
                return fallBack("Por favor, selecciona una opción válida.");
            }
            console.log("embarazada:", myState.embarazada)
            await saveInformationToDatabase(myState.IdWhats, myState.embarazada, 'embarazada', state);
            stop(ctx);
            return gotoFlow(denEnc1Flow)
        })
export default opcDen4Flow