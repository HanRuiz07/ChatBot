import { addKeyword, EVENTS } from '@builderbot/bot'
import { saveInformationToDatabase } from '~/services/postgresql';

import opcDen5Flow from '../opcDen5Flow';

const flujoUnoFlow = addKeyword(EVENTS.ACTION)

    .addAnswer('🚨 ¡Acuda a la *EMERGENCIA* del hospital más grande disponible en su zona! 🚨\n¡No tome *Ibuprofeno, Naproxeno*! 💊...*¡NO SE AUTOMEDIQUE!* 💊',)
    .addAction(async (ctx, { state, gotoFlow }) => {
        await state.update({ emergencia: '1' });
        const myState = state.getMyState();
        saveInformationToDatabase(myState.IdWhats, '1', 'emergencia', state);
        return gotoFlow(opcDen5Flow);
    })

export default flujoUnoFlow