import { addKeyword, EVENTS } from '@builderbot/bot';
import { createUserToDatabase } from '~/services/postgresql';
import { typing } from '~/utils/presence';
import { generateTimer } from '~/utils/utils';
import { createMessageQueue, QueueConfig } from '~/utils/fast-entires';

import moment from 'moment-timezone';

// Configurar moment en español solo una vez
moment.locale("es");

/**
 * 
 * Gestionar los
 * https://www.builderbot.app/en/showcases/fast-entires
 */
const queueConfig: QueueConfig = { gapMilliseconds: 3000 };
const enqueueMessage = createMessageQueue(queueConfig);

export const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { provider, state, flowDynamic }) => {
         const mensaje   
        await flowDynamic(mensaje){  }
        /**
         * Captura del tiempo + mensaje {mensaje, tiempo}
         */
    });
