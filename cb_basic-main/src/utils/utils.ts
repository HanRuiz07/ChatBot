import { utils } from "@builderbot/bot";
import { typing } from "./presence";

export function waitT(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms);
        }, ms)
    })
}

export function generateTimer(min: number, max: number) {
    const numSal = Math.random();
    const numeroAleatorio = Math.floor(numSal * (max - min + 1)) + min;
    return numeroAleatorio;
}

export function numberClean(raw: string) {
    //Mute +3400000 
    const number = raw.toLowerCase().replace('mute', '').replace(/\s/g, '').replace('+', '')
    // 3400000
    return number
};

export function toLowerCaseAndRemoveAccents(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos
};

export async function presence(ctx: any, provider: any, min: number, max: number) {
    await typing(ctx, provider);
    await utils.delay(generateTimer(min, max));
}