import { createFlow } from '@builderbot/bot'
import { idleFlow } from '~/utils/idle-custom'

import welcomeFlow from './welcomeFlow'
import menuFlow from './menuFlow'

import opc1Flow from './opc1Flow'
import opc2Flow from './opc2Flow'
import opc3Flow from './opc3Flow'
import opc4Flow from './opc4Flow'
import opc5Flow from './opc5Flow'
import opc7Flow from './opc7Flow'
import encFlow from './encFlow'
import inacFlow from './inacFlow'

import menuEnfFlow from './enfermedades/menuEnfFlow'

import menuDengue from './enfermedades/dengue/menuDengue'
import opcDen1Flow from './enfermedades/dengue/opcDen1Flow'
import opcDen2Flow from './enfermedades/dengue/opcDen2Flow'
import opcDen3Flow from './enfermedades/dengue/opcDen3Flow'
import opcDen4Flow from './enfermedades/dengue/opcDen4Flow'
import opcDen5Flow from './enfermedades/dengue/opcDen5Flow'
import denInacFlow from './enfermedades/dengue/denInacFlow'

import denEnc1Flow from './enfermedades/dengue/encuesta/denEnc1Flow'
import denEnc2Flow from './enfermedades/dengue/encuesta/denEnc2Flow'
import denEnc3Flow from './enfermedades/dengue/encuesta/denEnc3Flow'
import denEnc4Flow from './enfermedades/dengue/encuesta/denEnc4Flow'
import denEnc5Flow from './enfermedades/dengue/encuesta/denEnc5Flow'

import flujoUnoFlow from './enfermedades/dengue/encuesta/flujoUnoFlow'
import flujoDosFlow from './enfermedades/dengue/encuesta/flujoDosFlow'
import flujoTresFlow from './enfermedades/dengue/encuesta/flujoTresFlow'

import menuViruela from './enfermedades/viruela/menuViruela'
import opcVir1Flow from './enfermedades/viruela/opcVir1Flow'
import opcVir2Flow from './enfermedades/viruela/opcVir2Flow'
import opcVir3Flow from './enfermedades/viruela/opcVir3Flow'
import opcVir4Flow from './enfermedades/viruela/opcVir4Flow'
import opcVir5Flow from './enfermedades/viruela/opcVir5Flow'
import opcVir6Flow from './enfermedades/viruela/opcVir6Flow'
import opcVir7Flow from './enfermedades/viruela/opcVir7Flow'
import opcVir8Flow from './enfermedades/viruela/opcVir8Flow'

export default createFlow([
    //idle custom
    idleFlow,

    //Menu Principal
    welcomeFlow,
    menuFlow,

    //Opciónes del menú
    opc1Flow,
    opc2Flow,
    opc3Flow,
    opc4Flow,
    opc5Flow,
    opc7Flow,
    encFlow,
    inacFlow,

    //Menu de Enfermedades
    menuEnfFlow,

    //Dengue
    menuDengue,
    opcDen1Flow,
    opcDen2Flow,
    opcDen3Flow,
    opcDen4Flow,
    opcDen5Flow,
    denInacFlow,

    //Encuesta Dengue
    denEnc1Flow,
    denEnc2Flow,
    denEnc3Flow,
    denEnc4Flow,
    denEnc5Flow,

    //Flujos
    flujoUnoFlow,
    flujoDosFlow,
    flujoTresFlow,

    //Viruela del Monos
    menuViruela,
    opcVir1Flow,
    opcVir2Flow,
    opcVir3Flow,
    opcVir4Flow,
    opcVir5Flow,
    opcVir6Flow,
    opcVir7Flow,
    opcVir8Flow,
])