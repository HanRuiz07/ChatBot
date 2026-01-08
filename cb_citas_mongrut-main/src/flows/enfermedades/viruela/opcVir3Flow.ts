import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir2Flow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '✅ Evita el contacto directo con una persona que presenta síntomas compatibles con MPOX (viruela símica).',
        '✅ Lávate las manos frecuentemente con agua y jabón.',
        '✅ No toques las lesiones de una persona con MPOX (viruela símica).',
        '✅ No compartas ropa, ropa de cama, toallas ni otros objetos de uso personal con una persona con MPOX (viruela símica).',
        '✅ Usa mascarilla si es necesario acercarte a alguien con síntomas compatibles con MPOX (viruela símica).',
    ])

export default opcVir2Flow