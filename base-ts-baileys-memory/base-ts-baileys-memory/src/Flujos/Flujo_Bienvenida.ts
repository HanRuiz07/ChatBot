import { addKeyword, EVENTS } from '@builderbot/bot'
import { cleanIcon, toLowerCaseAndRemoveAccents } from '~/utils/utils';
import { saveInformationToDatabase } from '~/Servicios/postresql';
import { createUserToDatabase } from '~/Servicios/postresql';
import moment from 'moment-timezone';
import Flujo_Menu from './Flujo_Menu';
import Flujo_1 from './Flujo_1';
const Flujo_Bienvenida= addKeyword(EVENTS.WELCOME)
                        .addAction(async(ctx, {state,gotoFlow, endFlow, fallBack, provider})=> {

                            moment.locale('es');
                            const fecha_interaccion= moment().tz('America/Lima').format('DD/MM/YY HH:mm:ss');
                            const api=process.env.API; 

                            await(state.update({
                                cod_red:'',
                                cod_ses:'',
                                nameW: ctx.pushName,
                                IdWhats: ctx.key.id,
                                numbF: ctx.from,
                                mensaje_interaccion: cleanIcon(ctx.body),
                                fecha_interaccion: fecha_interaccion
                            }));
                            const myState=state.getMyState();
                            console.log(`El usuario ${myState.numbF} con nombre ${myState.nameW} inició conversación con "${myState.mensaje_interaccion}", el día ${myState.fecha_interaccion}`);

                            await createUserToDatabase(
                                myState.cod_red,
                                myState.cod_ses,
                                myState.IdWhats,
                                myState.nameW.replace(/[^a-zA-Z0-9 ]/g, ''),
                                myState.numbF,
                                myState.mensaje_interaccion,
                                myState.fecha_interaccion
                            
                            );

                            let mensaje:any = toLowerCaseAndRemoveAccents(myState.mensaje_interaccion);
                            // 'Excelente', 'Bueno', 'Regular', 'Malo', 'Muy malo'
        if (mensaje == 'excelente') {
            mensaje = '5'
        } else if (mensaje == 'bueno') {
            mensaje = '4'
        } else if (mensaje == 'regular') {
            mensaje = '3'
        } else if (mensaje == 'malo') {
            mensaje = '2'
        } else if (mensaje == 'muy malo') {
            mensaje = '1'
        }

        const auxmsg = Number(mensaje);

        if (typeof auxmsg === 'number' && auxmsg >= 1 && auxmsg <= 5) {
            try {
                const numero = myState.numbF.slice(-9);
                const response = await fetch(`${api}/citas/verificar`,
                    {
                        method: 'post',
                        body: JSON.stringify({
                            numero: numero,
                            condicion: -1
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    });
                const data: any = await response.json();
                if (data.error == false) {
                    const number = ctx.key.remoteJid
                    const json = data.body;
                    const key = JSON.parse(json.key);
                    await provider.vendor.sendMessage(number, { delete: key })
                    await saveInformationToDatabase(myState.IdWhats, myState.mensaje_interaccion, 'satisfaccion', state);
                    try {
                        const response = await fetch(`${api}/citas/comentario`,
                            {
                                method: 'post',
                                body: JSON.stringify({
                                    id: json.id,
                                    comentario: myState.mensaje_interaccion
                                }),
                                headers: { 'Content-Type': 'application/json' },
                            });
                        const data: any = await response.json();
                        const error = data.error;
                        if (error == false) {
                            console.log(`el usuario ${myState.numbF} realizo la encuesta ${myState.mensaje_interaccion} con exito`);
                        } else {
                            console.error(`error al guardar la encuesta ${data.body}`);
                        }
                    } catch (error) {
                        console.error(`error al guardar la encuesta ${myState.mensaje_interaccion} del usuario ${myState.IdWhats}:  ${error}`);
                    }
                    return endFlow(`Seleccionaste la opción *${myState.mensaje_interaccion}*. Gracias por tu respuesta.`);
                }
            } catch (error) {
                console.error(`error al verificar al usuario ${myState.IdWhats} para realizar la encuesta: ${error}`);
            }
        }

        try {
            const numero = myState.numbF.slice(-9);
            const response = await fetch(`${api}/citas/verificar`,
                {
                    method: 'post',
                    body: JSON.stringify({
                        numero: numero,
                        condicion: 0
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
            const data: any = await response.json();
            if (data.error == false) {
                const json = data.body;
                try {
                    const response = await fetch(`${api}/citas/comentario`,
                        {
                            method: 'post',
                            body: JSON.stringify({
                                id: json.id,
                                comentario: mensaje
                            }),
                            headers: { 'Content-Type': 'application/json' },
                        });
                    const data: any = await response.json();
                    const error = data.error;
                    if (error == true) {
                        console.log(`Error al guardar la interaccion ${data.body}`);
                    }
                } catch (error) {
                    console.error(`Error al guardar la interaccion ${auxmsg} del al usuario ${myState.IdWhats}:  ${error}`);
                }
            }
        } catch (error) {
            console.error(`Error al verificar al usuario ${myState.IdWhats}: ${error}`);
        }

        if (mensaje == 'no') {
            try {
                const numero = myState.numbF.slice(-9);
                const response = await fetch(`${api}/citas/verificar`,
                    {
                        method: 'post',
                        body: JSON.stringify({
                            numero: numero,
                            condicion: 5
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    });
                const data: any = await response.json();
                const body = data.body;
                if (body == 'El número de teléfono existe') {
                    await saveInformationToDatabase(myState.IdWhats, true, 'usuario_verificado', state);
                    await saveInformationToDatabase(myState.IdWhats, true, 'cancelar_cita', state);
                    return gotoFlow(Flujo_1);
                }
            } catch (error) {
                console.error(`Error al verificar al usuario ${myState.IdWhats}: ${error}`);
            }
        }

        if (mensaje.includes('gracias') ) {
            return endFlow(`¡Es un placer ayudarte! 😄\n\nAdemás de recordarte tus citas, puedo darte detalles sobre el Hospital Octavio Mongrut Muñoz. ¡Consulta el menú cuando quieras escribiendo *"Hola"*!`);
        }
       


                        } )
                        .addAnswer('*👩‍⚕️👨‍⚕️ Bienvenido al ChatBot de EsSalud. 🏥💙*')
                        .addAnswer('Estamos aquí para ayudarte con información sobre nuestros servicios. Por favor, selecciona una opción para continuar:')
                        .addAction(async (ctx, { gotoFlow }) => { return gotoFlow(Flujo_Menu) })

export default Flujo_Bienvenida