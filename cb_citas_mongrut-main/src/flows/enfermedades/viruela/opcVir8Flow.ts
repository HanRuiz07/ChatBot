import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

const opcVir8Flow = addKeyword(EVENTS.ACTION)
    
    .addAnswer('Existe una vacuna contra la MPOX (viruela símica), que es indicada por el médico tratante para casos muy específicos previa valoración.')

export default opcVir8Flow