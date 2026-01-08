import { addKeyword, EVENTS } from '@builderbot/bot'

import Flujo_Final_Dengue from './Flujo_Final_Dengue';

const Menu_Dengue_2 = addKeyword(EVENTS.ACTION)

    .addAnswer('El dengue se transmite cuando el zancudo *Aedes aegypti* pica a un enfermo y se contagia del virus; luego al picar a otras personas sanas transmite la enfermedad.',
        null,
        async (ctx, { state, gotoFlow }) => {
            return gotoFlow(Flujo_Final_Dengue);
        }
    )


export default Menu_Dengue_2