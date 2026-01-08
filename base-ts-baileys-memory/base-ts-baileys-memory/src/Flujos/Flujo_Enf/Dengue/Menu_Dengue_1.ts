import { addKeyword ,EVENTS} from "@builderbot/bot";
import Flujo_Final_Dengue from "./Flujo_Final_Dengue";
const Menu_Dengue_1=addKeyword(EVENTS.ACTION)
                    .addAnswer('El Dengue es una enfermedad infecciosa aguda causada por un virus que es trasmitida a través de un zancudo desde una persona enferma hacia otra que está sana.'
                        ,null,
                        async (ctx, {state,gotoFlow}) =>{
                            return gotoFlow(Flujo_Final_Dengue)
                        }
                    )
 

export default Menu_Dengue_1