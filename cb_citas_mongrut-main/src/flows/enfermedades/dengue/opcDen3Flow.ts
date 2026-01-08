import { addKeyword, EVENTS } from '@builderbot/bot'

import denInacFlow from './denInacFlow';

const opcDen3Flow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '✅ Lava, lava, lava bien (con la escobilla los depósitos donde almacenas agua).',
        '✅ Tapa, tapa, tapa bien (los depósitos donde almacenas agua para consumo).',
        '✅ Bota, bota, bota bien (los depósitos que no usas donde puede acumularse agua por accidente).',
    ],
        null,
        async (ctx, { state, gotoFlow }) => {
            return gotoFlow(denInacFlow);
        })


export default opcDen3Flow