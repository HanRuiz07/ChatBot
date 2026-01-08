import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '~/utils/idle-custom';

import { cleanIcon, toLowerCaseAndRemoveAccents } from '~/utils/utils';

import Flujo_1 from './Flujo_1';
import Flujo_2 from './Flujo_2';
import Flujo_3 from './Flujo_3';
import Flujo_4 from './Flujo_4';
import Flujo_5 from './Flujo_5';
import Flujo_7 from './Flujo_7';
import Menu_Enfermedades from './Flujo_Enf/Menu_Enfermedades';
const Flujo_Menu= addKeyword(EVENTS.ACTION)
                .addAction(async (ctx, {gotoFlow})=>start(ctx,gotoFlow,300000))
                .addAnswer(
                    [                       
                        '1️⃣ *¿Cómo cancelar mi cita?',
                        '2️⃣ *Conoce los servicios del Hospital Pablo Bermudez*',
                        '3️⃣ *Información sobre Trámites de Subsidio*',
                        '4️⃣ *¿Quieres denunciar un presunto acto de corrupción?*',
                        '5️⃣ *Libro de reclamaciones*',
                        '6️⃣ *Información sobre enfermedades de riesgo*',
                        '7️⃣ *Configurar notificaciones*'
                    ]
                ).addAnswer(
                    'Escriba el número que deseas seleccionar', {capture:true},
                    async(ctx, {state, gotoFlow,fallBack}) => {
                        reset(ctx, gotoFlow, 300000);
                        await state.update({ userAnswer: cleanIcon(ctx.body), });
                        const myState = state.getMyState();
                        const mensaje = toLowerCaseAndRemoveAccents(myState.userAnswer);
                        if (mensaje.includes('gracias')) {
                            return fallBack(`¡Encantado de ayudarte! 😊\n\nPara obtener más información específica sobre el Hospital Pablo Bermudez, solo elige una de las opciones del menú. ¡Estoy aquí para asistirte!`);
                        }            
                        
                        switch(myState.userAnswer){
                            case '1':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_1);  
                            case '2':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_2);
                            case '3':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_3);
                            case '4':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_4);
                            case '5':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_5);
                            case '6':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Menu_Enfermedades);
                            case '7':
                                stop(ctx);
                                console.log(`el usuario ${myState.numbF} escogio: ${myState.userAnswer}`)
                                return gotoFlow(Flujo_7);
                            default:
                                console.log(`el usuario ${myState.numbF} escribio un valor incorrecto: ${myState.userAnswer}`)
                                return fallBack('❌ Opción no válida, por favor escoga un número 🔢.');
            
                        }
                    }
                    
                    )

export default Flujo_Menu