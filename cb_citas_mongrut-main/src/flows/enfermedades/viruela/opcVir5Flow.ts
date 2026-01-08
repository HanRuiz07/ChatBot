import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir5Flow = addKeyword(EVENTS.ACTION)

    .addAnswer('El diagnóstico se hace mediante la toma de muestras de secreciones de acuerdo con la indicación de su médico tratante.')

export default opcVir5Flow