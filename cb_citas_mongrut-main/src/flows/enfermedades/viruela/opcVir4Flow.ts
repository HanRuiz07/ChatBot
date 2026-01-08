import { addKeyword, EVENTS } from '@builderbot/bot'

const opcVir4Flow = addKeyword(EVENTS.ACTION)

    .addAnswer('Lesiones dolorosas en la piel que comienzan como manchas, progresan a ampollas y terminan en costras en el área genital o perianal, palmas de las manos, plantas de los pies, cara, manos, pies.')
    .addAnswer([
        'Así como cualquiera de los siguientes síntomas asociados:',
        '✅ Fiebre',
        '✅ Dolor de cabeza',
        '✅ Fatiga',
        '✅ Dolor muscular',
        '✅ Ganglios inflamados (ganglios grandes y dolorosos)',
    ])
    .addAnswer('Los síntomas pueden ser más severos en personas con inmunidad baja (defensas bajas), particularmente quienes viven con VIH.')


export default opcVir4Flow