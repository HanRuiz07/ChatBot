import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';
import { waitT } from '~/utils/utils';

const encFlow = addKeyword(EVENTS.ACTION)

    .addAnswer([],
        { capture: true },
        async (ctx, { provider, state, flowDynamic }) => {
            const number = parseInt(ctx.body)
            if (number > 0 || number < 10) {
                const number = ctx.key.remoteJid
                const myState = state.getMyState();
                console.log(myState.msjkey)
                const key = myState.msjkey.key
                await waitT(1000)
                await provider.vendor.sendMessage(number, { delete: key })
                await flowDynamic('Ustedes han votado por el número ' + ctx.body)
            } else {
                await flowDynamic('Debe seleccionar un número del 1 al 9')
            }
        }
    )

export default encFlow