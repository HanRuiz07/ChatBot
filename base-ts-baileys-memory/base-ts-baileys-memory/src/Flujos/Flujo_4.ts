import { addKeyword, EVENTS } from "@builderbot/bot"
import Flujo_Final from "./Flujo_Final"
const Flujo_4=addKeyword(EVENTS.ACTION).
                addAnswer('✳️ A través del formulario virtual de denuncias de EsSalud, https://ww10.essalud.gob.pe/ofin/denuncias/formulario/').
                addAnswer('✳️ Plataforma Digital Única de Denuncias del Ciudadano https://denuncias.servicios.gob.pe').
                addAnswer('✳️ En la Sala de Denuncias del Seguro Social de Salud - EsSalud, ubicada en el Edificio Lima (Av. Arenales 1402 – piso 2)').
                addAnswer('✳️ Vía correo electrónico: denuncias@essalud.gob.pe').
                addAnswer('✳️ Vía telefónica al (01) 265-6000 Anexo 2996').
                addAction(async (ctx, {state,gotoFlow}) => {return gotoFlow(Flujo_Final)})
export default Flujo_4