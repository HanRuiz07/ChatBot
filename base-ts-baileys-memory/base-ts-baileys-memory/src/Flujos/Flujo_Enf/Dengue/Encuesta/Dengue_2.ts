import { addKeyword, EVENTS } from '@builderbot/bot'
import { saveInformationToDatabase } from '~/Servicios/postresql';

import Menu_Dengue_5 from '../Menu_Dengue_5';
const Dengue_2 = addKeyword(EVENTS.ACTION)

    .addAnswer('🚨 ¡Acuda a la *EMERGENCIA* del hospital más grande disponible en su zona! 🚨\n¡No tome *Ibuprofeno, Naproxeno*! 💊...*¡NO SE AUTOMEDIQUE!* 💊',)
    .addAction(async (ctx, { state, gotoFlow }) => {
        await state.update({ emergencia: '2' });
        const myState = state.getMyState();
        saveInformationToDatabase(myState.IdWhats, '2', 'emergencia', state);
        return gotoFlow(Menu_Dengue_5);
    })

export default Dengue_2