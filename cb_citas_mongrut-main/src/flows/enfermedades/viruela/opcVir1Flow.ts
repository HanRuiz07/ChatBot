import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir1Flow = addKeyword(EVENTS.ACTION)


    .addAnswer('La MPOX (viruela símica) es una enfermedad viral producida por el virus de MPOX muy contagiosa y transmitida principalmente mediante contacto físico estrecho y sexual.')
    .addAnswer('Si bien es prevenible y la mayoría de las personas se recuperan, algunos casos progresan a formas severas y mayor mortalidad.')
    .addAnswer('En el Perú, desde su introducción el 2022, hemos seguido teniendo casos esporádicos.')

export default opcVir1Flow