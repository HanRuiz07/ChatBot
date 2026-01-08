import { addKeyword , EVENTS} from "@builderbot/bot";
import Flujo_Menu from "~/Flujos/Flujo_Menu";
import { start,reset, stop } from "~/utils/idle-custom";
import { cleanIcon } from "~/utils/utils";
 const Flujo_Final_Dengue= addKeyword(EVENTS.ACTION)
                            .addAction(async(ctx, {state,gotoFlow}) => start(ctx,gotoFlow,300000))
                            .addAnswer(
                                [
                                    '👨🏻‍⚕️Fue un gusto atenderte.👨🏻‍⚕',
                                    'Escriba su opción como mejor requiera.\n\n',
                                    '1️⃣Menú Principal.',
                                    '2️⃣Menú de enfermedades.',
                                    '3️⃣Terminar consulta.'
                                ], {capture:true}, async(ctx,{state,fallBack,endFlow,gotoFlow})=> {
                                    reset(ctx,gotoFlow,300000);
                                    await state.update({userAnswer: cleanIcon(ctx.body)});
                                    const myState= state.getMyState();
                                    switch(myState.userAnswer){
                                        case '1':
                                            stop(ctx);
                                            console.log(`El usuario ${myState.numbF} escogió la opción ${myState.userAnswer} - Menú Principal`);
                                            return gotoFlow(Flujo_Menu)
                                        case '2':
                                            stop(ctx);
                                            console.log(`El usuario ${myState.numbF} escogió la opción ${myState.userAnswer} - Menú de Enfermedades`);
                                            return gotoFlow(Flujo_Menu)
                                        case '3':
                                            stop(ctx);
                                            console.log(`El usuario ${myState.numbF} escogió la opción ${myState.userAnswer} - Terminar Consulta`);
                                            return endFlow('¡Gracias por usar nuestro servicio!\nEstamos aquí para ayudarte.😊')
                                        default:
                                            console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                                            return fallBack('❌ Opción no válida, por favor escoga un número 🔢.');
                                    }
                                }
                            )

 export default Flujo_Final_Dengue