import { addKeyword, EVENTS } from "@builderbot/bot"
import {start, reset,stop } from "~/utils/idle-custom"
import Flujo_Menu from "./Flujo_Menu";


const Flujo_Final=addKeyword(EVENTS.ACTION).
                    addAction(async (ctx, {gotoFlow}) =>
                        start(ctx,gotoFlow,300000)
                ).
                    addAnswer([
                        '👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕',
                        'Escriba su opción como mejor requiera.\n\n',
                        '1️⃣Menú Principal.',
                        '2️⃣Finalizar la conversación.'
                    ],
                    {capture:true},
                    async (ctx,{state,gotoFlow,fallBack,endFlow}) =>{
                        reset(ctx,gotoFlow,300000);
                        await state.update({userAnswer:ctx.body});
                        const myState=state.getMyState();
                        switch(ctx.body){
                            case '1':
                                stop(ctx)
                                console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer} - Menú Principal.`);
                                return gotoFlow(Flujo_Menu);
                            case '2':
                                stop(ctx)
                                console.log(`el usuario ${myState.numbF} seleccionó la opción: ${myState.userAnswer} - Finalizar conversación.`);
                                return endFlow('¡Gracias por usar nuestro servicio!\nEstamos aquí para ayudarte.😊');
                            default:
                                console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                                return fallBack('❌ Opción no válida, por favor escoga un número 🔢.');
                        }

                    }
                    
                )
export default Flujo_Final  