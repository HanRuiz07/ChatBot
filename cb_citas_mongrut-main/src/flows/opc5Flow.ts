import { addKeyword, EVENTS } from '@builderbot/bot'

import inacFlow from './inacFlow'

const opc5Flow = addKeyword(EVENTS.ACTION)

    .addAnswer('Presenta tus quejas o sugerencias para mejorar el servicio brindado, https://portal.essalud.gob.pe/libroreclamaciones/ ')
    .addAction(async (ctx, { state, gotoFlow }) => { return gotoFlow(inacFlow) })

export default opc5Flow