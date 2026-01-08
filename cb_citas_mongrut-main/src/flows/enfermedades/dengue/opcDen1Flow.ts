import { addKeyword, EVENTS } from '@builderbot/bot'

import denInacFlow from './denInacFlow'

const opcDen1Flow = addKeyword(EVENTS.ACTION)

    .addAnswer(
        'El Dengue es una enfermedad infecciosa aguda causada por un virus que es trasmitida a través de un zancudo desde una persona enferma hacia otra que está sana.',
        null,
        async (ctx, { state, gotoFlow }) => {
            return gotoFlow(denInacFlow);
        }
    )


export default opcDen1Flow