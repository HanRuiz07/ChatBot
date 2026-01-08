import { saveOptionToDatabase } from "~/Servicios/postresql";

export const waitT = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms);
        }, ms)
    })
}

export const numberClean = (raw: string): string => {
    //Mute +3400000 
    const number = raw.toLowerCase().replace('mute', '').replace(/\s/g, '').replace('+', '')
    // 3400000
    return number
};

export const toLowerCaseAndRemoveAccents = (text: string): string => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos
};

export const cleanIcon = (text: string): string => {
    return text.replace(/[^\x20-\x7EáéíóúñÑ]+/g, 'icono')
};

export function crearMensaje(id: any, state: any, data: any, flujo: any) {
    let mensaje = "🏥 *El hospital más cercano es:*\n";
    if (flujo == 0) {
        mensaje = "🏥 *Los centro de EsSalud más cercanos son:*\n";
    }
    for (const itm of data) {
        mensaje += `\n🚨 *Nivel de emergencia ${itm.flujo}:*\n`;
        mensaje += `${itm.nombre} a ${parseFloat(itm.distancia).toFixed(2)} Km\n`;
        mensaje += `📍 *Ubicación en GoogleMaps:*\n${itm.enlace}\n`;
        saveOptionToDatabase(id, itm.nombre, 'centrosdesalud', state);
    }
    return mensaje;
}