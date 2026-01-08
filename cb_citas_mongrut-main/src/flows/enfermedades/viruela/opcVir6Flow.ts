import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir6Flow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '✅ Dirígete a tu centro de salud usando mascarilla en todo momento y evitando contacto con otras personas.',
        '✅ Protege a otros evitando el contacto directo físico y sexual con otras personas.',
        '✅ Viste ropas que cubran tu piel, especialmente las lesiones.',
        '✅ Brinda la información adicional que solicite tu médico, colabora con el personal de salud.',
        '✅ Si vives con otras personas, mantente en un cuarto separado, y desinfecta los objetos y superficies que toques.',
        '✅ Evita el contacto con tus mascotas y otros animales. Tu mascota puede enfermar por MPOX (viruela símica) y contagiar a otros animales y personas.',
    ],)

export default opcVir6Flow