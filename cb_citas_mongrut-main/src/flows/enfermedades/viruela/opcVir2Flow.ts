import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir2Flow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '✅ Por contacto directo con erupciones infecciosas, costras, fluidos corporales.',
        '✅ Secreciones respiratorias durante el contacto prolongado, cara a cara o el contacto físico íntimo (besos, abrazos, relaciones sexuales).',
        '✅ Contacto directo con el material de la lesión, como ropa de cama o artículos de higiene personal.',
        '✅ De madre a hijo durante el embarazo y la lactancia.'
    ])

export default opcVir2Flow