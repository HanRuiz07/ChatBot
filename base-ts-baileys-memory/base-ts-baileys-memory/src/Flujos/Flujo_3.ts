import { addKeyword, EVENTS } from "@builderbot/bot"
import Flujo_Final from "./Flujo_Final"

const Flujo_3= addKeyword(EVENTS.ACTION).
                addAnswer('Recuerda que todos los trámites de subsidios en EsSalud son *GRATUITOS*.').
                addAnswer('Conoce todo los tipos de subsidios en nuestra página oficial de EsSalud, https://www.gob.pe/institucion/essalud/tema/prestaciones-economicas').
                addAction(async (ctx, {state, gotoFlow})=> {return gotoFlow(Flujo_Final)})


export default Flujo_3