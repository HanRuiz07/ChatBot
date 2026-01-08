import { addKeyword,EVENTS } from "@builderbot/bot"
import Flujo_Final from "./Flujo_Final"

const Flujo_1=addKeyword(EVENTS.ACTION)
            .addAnswer('Para cancelar tu cita, puedes hacerlo por los siguientes canales:')
            .addAnswer('1️⃣ Mi Consulta https://miconsulta.essalud.gob.pe/')
            .addAnswer('2️⃣ Llamando al (01) 411-8000.')
            .addAnswer('Recuerda que, *si no puedes asistir y cancelas tu cita*, otra persona podrá atenderse.')
            .addAction(async(ctx, {state,gotoFlow})=>{return gotoFlow(Flujo_Final)})

export default Flujo_1

