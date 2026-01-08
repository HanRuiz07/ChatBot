import { createFlow } from '@builderbot/bot'
import { idleFlow } from '~/utils/idle-custom'

import Flujo_Bienvenida from './Flujo_Bienvenida'
import Flujo_Menu from './Flujo_Menu'
import Flujo_1 from './Flujo_1'
import Flujo_2 from './Flujo_2'
import Flujo_3 from './Flujo_3'
import Flujo_4 from './Flujo_4'
import Flujo_5 from './Flujo_5'
import Flujo_7 from './Flujo_7'
import Flujo_Final from './Flujo_Final'

import Menu_Enfermedades from './Flujo_Enf/Menu_Enfermedades'

import Menu_Dengue from './Flujo_Enf/Dengue/Menu_Dengue'
import Menu_Dengue_1 from './Flujo_Enf/Dengue/Menu_Dengue_1'
import Menu_Dengue_2 from './Flujo_Enf/Dengue/Menu_Dengue_2'
import Menu_Dengue_3 from './Flujo_Enf/Dengue/Menu_Dengue_3'
import Menu_Dengue_4 from './Flujo_Enf/Dengue/Menu_Dengue_4'
import Menu_Dengue_5 from './Flujo_Enf/Dengue/Menu_Dengue_5'
import Flujo_Final_Dengue from './Flujo_Enf/Dengue/Flujo_Final_Dengue'
import Dengue_1 from './Flujo_Enf/Dengue/Encuesta/Dengue_1'
import Dengue_2 from './Flujo_Enf/Dengue/Encuesta/Dengue_2'
import Dengue_3 from './Flujo_Enf/Dengue/Encuesta/Dengue_3'
import Encuesta_Dengue_1 from './Flujo_Enf/Dengue/Encuesta/Encuesta_Dengue_1'
import Encuesta_Dengue_2 from './Flujo_Enf/Dengue/Encuesta/Encuesta_Dengue_2'
import Encuesta_Dengue_3 from './Flujo_Enf/Dengue/Encuesta/Encuesta_Dengue_3'
import Encuesta_Dengue_4 from './Flujo_Enf/Dengue/Encuesta/Encuesta_Dengue_4'
import Encuesta_Dengue_5 from './Flujo_Enf/Dengue/Encuesta/Encuesta_Dengue_5'


/*import denEnc1Flow from './enfermedades/dengue/encuesta/denEnc1Flow'
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
import opcVir8Flow from './enfermedades/viruela/opcVir8Flow'*/

export default createFlow([
    //idle custom
    idleFlow,

    //Menu Principal
    Flujo_Bienvenida,
    Flujo_Menu,

    //Opciónes del menú
             Flujo_1,
             Flujo_2,
             Flujo_3,
             Flujo_4,
             Flujo_5,
             Flujo_7,
    //encFlow,
             Flujo_Final,

    //Menu de Enfermedades
            Menu_Enfermedades,

    //Dengue
            Menu_Dengue,
            Menu_Dengue_1,
            Menu_Dengue_2,
            Menu_Dengue_3,
            Menu_Dengue_4,
            Menu_Dengue_5,
            Flujo_Final_Dengue,

    //Encuesta Dengue
            Encuesta_Dengue_1,
            Encuesta_Dengue_2,
            Encuesta_Dengue_3,
            Encuesta_Dengue_4,
            Encuesta_Dengue_5,

    //Flujos
            Dengue_1,
            Dengue_2,
            Dengue_3,

    //Viruela del Monos
   /* menuViruela,
    opcVir1Flow,
    opcVir2Flow,
    opcVir3Flow,
    opcVir4Flow,
    opcVir5Flow,
    opcVir6Flow,
    opcVir7Flow,
    opcVir8Flow,*/
])