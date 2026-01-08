import { addKeyword, EVENTS } from "@builderbot/bot"
import Flujo_Final from "./Flujo_Final"

const Flujo_5=addKeyword(EVENTS.ACTION).
            addAnswer('Presenta tus quejas o sugerencias para mejorar el servicio brindado, https://portal.essalud.gob.pe/libroreclamaciones/ ').
            addAction(async (ctx, {state, gotoFlow}) => {return gotoFlow(Flujo_Final)})
export default Flujo_5