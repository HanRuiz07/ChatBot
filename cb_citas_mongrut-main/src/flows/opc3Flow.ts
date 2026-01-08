import { addKeyword, EVENTS } from '@builderbot/bot'

import inacFlow from './inacFlow'

const opc3Flow = addKeyword(EVENTS.ACTION)

    .addAnswer('Recuerda que todos los trámites de subsidios en EsSalud son *gratuitos*.')
    .addAnswer('Conoce todo los tipos de subsidios en nuestra página oficial de EsSalud, https://www.gob.pe/institucion/essalud/tema/prestaciones-economicas')
    .addAction(async (ctx, { state, gotoFlow }) => { return gotoFlow(inacFlow) })

export default opc3Flow 