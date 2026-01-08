import { addKeyword , EVENTS} from "@builderbot/bot";
import { saveOptionToDatabase } from "~/Servicios/postresql";
import { start,reset,stop } from "~/utils/idle-custom";
import { cleanIcon } from "~/utils/utils";

import Flujo_Menu from "~/Flujos/Flujo_Menu";
import Menu_Dengue_1 from "./Menu_Dengue_1";
import Menu_Dengue_2 from "./Menu_Dengue_2";
import Menu_Dengue_3 from "./Menu_Dengue_3";
import Menu_Dengue_4 from "./Menu_Dengue_4";
import Menu_Dengue_5 from "./Menu_Dengue_5";


const Menu_Dengue=addKeyword(EVENTS.ACTION)
                .addAction(async (ctx, {state, gotoFlow}) => start(ctx,gotoFlow,300000))
                .addAnswer(
                    [
                        '1️⃣ ¿Qué es el Dengue? 🦟',
                        '2️⃣ ¿Cómo se transmite el dengue? 🤝',
                        '3️⃣ ¿Cómo prevenir el dengue? 🛡️',
                        '4️⃣ *Quiero saber si tengo dengue.* 🤒',
                        '5️⃣ *Ver centros de EsSalud cercanos.* 🏥',
                        '#️⃣ *Menu Principal* 🏠',
                    ], 
                    {capture:true}, 
                    async (ctx,{state, gotoFlow,fallBack}) =>{
                        reset(ctx,gotoFlow,300000);
                        await state.update({userAnswer: cleanIcon(ctx.body)});
                        const myState=state.getMyState();
                        switch(myState.userAnswer){
                            case '1':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- '¿Qué es el Dengue?'`)
                                return gotoFlow(Menu_Dengue_1); 
                            case '2':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- '¿Cómo se transmite el dengue?'`)
                                return gotoFlow(Menu_Dengue_2);
                            case '3':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- '¿Cómo prevenir el dengue?'`)
                                return gotoFlow(Menu_Dengue_3);
                            case '4':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- 'Quiero saber si tengo dengue.'`)
                                return gotoFlow(Menu_Dengue_4);
                            case '5':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- 'Ver centros de EsSalud cercanos.'`)
                                return gotoFlow(Menu_Dengue_5);
                            case '#':
                                stop(ctx);
                                await saveOptionToDatabase(myState.IdWhats, myState.userAnswer, 'mensaje_dengue', state);
                                console.log(`El usuario ${myState.numbF} seleccionó la opción ${myState.userAnswer}- 'Menú Principal'`)
                                return gotoFlow(Flujo_Menu);
                            default:
                                return fallBack('❌ Opción no válida, por favor selecciona una opción válida.');
                        }
                    }
                )

export default Menu_Dengue