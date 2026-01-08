import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

const dbconfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
};

const pool = new Pool(dbconfig);

async function conPostgres(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log('Conexión a PostgreSQL exitosa');
        client.release();
    } catch (error) {
        console.error('Error en la conexión a PostgreSQL: ', error);
        // Puedes incluir un retry aquí si deseas
    }
}

async function createUserToDatabase(cod_red: any, cod_ses: any, id_whats: any, name_whats: any, number_phone: any, mensaje_interaccion: any, fecha_interaccion: any) {
    try {
        const { rows } = await pool.query(
            'select * from citas.sp_crear_interaccion($1, $2, $3, $4, $5, $6, $7) as result',
            [cod_red, cod_ses, id_whats, name_whats, number_phone, mensaje_interaccion, fecha_interaccion]
        );
        const { result } = rows[0];
        if (result.estado == 'error') {
            console.log(`Error al crear al usuario ${id_whats}: ${result.error}`);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function saveOptionToDatabase(id_whats: any, option: any, campo: any, state: any) {
    try {
        const { rows } = await pool.query(
            'select * from citas.sp_guardar_opciones($1, $2, $3) as result',
            [id_whats, option, campo]
        );
        const { result } = rows[0];
        if (result.estado == 'error') {
            console.log(`Error al crear al usuario ${id_whats}: ${result.error}`);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function saveInformationToDatabase(id_whats: any, option: any, campo: any, state: any) {
    try {
        const { rows } = await pool.query(
            'select * from citas.sp_guardar_informacion($1, $2, $3) as result',
            [id_whats, option, campo]
        );
        const { result } = rows[0];
        if (result.estado == 'error') {
            console.log(`Error al crear al usuario ${id_whats}: ${result.error}`);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}


export {
    conPostgres,
    createUserToDatabase,
    saveOptionToDatabase,
    saveInformationToDatabase
};
