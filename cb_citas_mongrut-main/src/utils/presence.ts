import { waitT } from "./utils";

const typing = async function (ctx: any, provider: any) {
    if (provider && provider?.vendor && provider.vendor?.sendPresenceUpdate) {
        const id = ctx.key.remoteJid
        await waitT(100)
        await provider.vendor.sendPresenceUpdate('composing', id)
    }
}
const recording = async function (ctx: any, provider: any) {
    if (provider && provider?.vendor && provider.vendor?.sendPresenceUpdate) {
        const id = ctx.key.remoteJid
        await provider.vendor.sendPresenceUpdate('recording', id)
    }
}

export { typing, recording }