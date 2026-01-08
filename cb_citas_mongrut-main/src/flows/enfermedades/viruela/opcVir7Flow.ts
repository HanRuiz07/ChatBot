import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir7Flow = addKeyword(EVENTS.ACTION)
    
    .addAnswer('La Organización Mundial de la Salud ha declarado una emergencia de salud pública de importancia internacional debido a un brote de MPOX (viruela símica).')
    .addAnswer('Ocasionado por una nueva variante que está emergiendo actualmente que causa enfermedad más severa y mortal (clado 1b).')

export default opcVir7Flow