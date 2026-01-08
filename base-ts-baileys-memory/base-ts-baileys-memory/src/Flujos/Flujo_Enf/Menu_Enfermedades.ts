import { addKeyword,EVENTS } from "@builderbot/bot"
import { start,reset,stop } from "~/utils/idle-custom";
import { saveOptionToDatabase } from "~/Servicios/postresql";
import Flujo_Menu from "../Flujo_Menu";
import Menu_Dengue from "./Dengue/Menu_Dengue";
const Menu_Enfermedades=addKeyword(EVENTS.ACTION)
                        .addAction(async(ctx, {state, gotoFlow}) => start(ctx,gotoFlow,300000))
                        .addAnswer([
                            '*❓🩺 ¿Sobre qué enfermedad quieres saber?*\n\n',
                              '1️⃣ *Dengue*',
                              '#️⃣ *Menu Principal* 🏠',
                        ], {capture:true},
                    async(ctx, {state,gotoFlow,fallBack}) => {
                        reset(ctx,gotoFlow,300000);
                        await state.update({userAnswer: ctx.body});
                        const myState=state.getMyState();
                        //console.log(`El usuario ${myState.numbF} eligió la opción ${myState.userAnswer} - `)
                        switch(myState.userAnswer){
                            case '1':
                                console.log(`El usuario ${myState.numbF} eligió la opción ${myState.userAnswer} - Menu Dengue`)
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_enfermedades', myState);
                                return gotoFlow(Menu_Dengue);
                            case '#':
                                console.log(`El usuario ${myState.numbF} eligió la opción ${myState.userAnswer} - Menú Principal`)
                                stop(ctx);
                                return gotoFlow(Flujo_Menu)
                            default:
                                return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');

                        }
                    }
                    )
export default Menu_Enfermedades