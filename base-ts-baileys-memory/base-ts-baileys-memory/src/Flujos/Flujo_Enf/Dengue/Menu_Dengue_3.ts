import { addKeyword, EVENTS } from '@builderbot/bot'

import Flujo_Final_Dengue from './Flujo_Final_Dengue';

const Menu_Dengue_3 = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '✅ Lava, lava, lava bien (con la escobilla los depósitos donde almacenas agua).',
        '✅ Tapa, tapa, tapa bien (los depósitos donde almacenas agua para consumo).',
        '✅ Bota, bota, bota bien (los depósitos que no usas donde puede acumularse agua por accidente).',
    ],
        null,
        async (ctx, { state, gotoFlow }) => {
            return gotoFlow(Flujo_Final_Dengue);
        })


export default Menu_Dengue_3