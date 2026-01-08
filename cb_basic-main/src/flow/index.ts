
import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";


export default createFlow([
    
    /**
     * 
     * Seguir estructura para nombrar al flujo const (nombre + Flow)
     * Seguir estructura para nombrar al archivo (nombre.flow.ts)
     */

    welcomeFlow,
])