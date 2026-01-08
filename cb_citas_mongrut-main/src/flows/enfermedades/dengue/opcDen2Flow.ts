import { addKeyword, EVENTS } from '@builderbot/bot'

import denInacFlow from './denInacFlow';

const opcDen2Flow = addKeyword(EVENTS.ACTION)

    .addAnswer('El dengue se transmite cuando el zancudo *Aedes aegypti* pica a un enfermo y se contagia del virus; luego al picar a otras personas sanas transmite la enfermedad.',
        null,
        async (ctx, { state, gotoFlow }) => {
            return gotoFlow(denInacFlow);
        }
    )


export default opcDen2Flow