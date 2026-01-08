CREATE TABLE citas.interacciones (
    id SERIAL PRIMARY KEY,
    cod_red TEXT NOT NULL,
    cod_ses TEXT NOT NULL,
    id_whats TEXT NOT NULL DEFAULT '',
    name_whats TEXT NOT NULL DEFAULT '',
    number_phone TEXT NOT NULL DEFAULT '',
    mensaje_interaccion TEXT NOT NULL DEFAULT '',
    fecha_interaccion TEXT NOT NULL DEFAULT '',
    mensaje_menu TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    mensaje_servicios TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    mensaje_enfermedades TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    mensaje_dengue TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    mensaje_notificaciones TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    usuario_verificado BOOLEAN DEFAULT FALSE,
    cancelar_cita BOOLEAN DEFAULT FALSE,
    distrito TEXT NOT NULL DEFAULT '',
    provincia TEXT NOT NULL DEFAULT '',
    departamento TEXT NOT NULL DEFAULT '',
    pais TEXT NOT NULL DEFAULT '',
    latitud TEXT NOT NULL DEFAULT '',
    longitud TEXT NOT NULL DEFAULT '',
    nombre TEXT NOT NULL DEFAULT '',
    sexo TEXT NOT NULL DEFAULT '',
    dni TEXT NOT NULL DEFAULT '',
    edad TEXT NOT NULL DEFAULT '',
    embarazo TEXT NOT NULL DEFAULT '',
    fiebre TEXT NOT NULL DEFAULT '',
    dias TEXT NOT NULL DEFAULT '',
    satisfaccion TEXT NOT NULL DEFAULT '',
    encuesta1 TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    encuesta2 TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    encuesta3 TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    encuesta4 TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    emergencia TEXT NOT NULL DEFAULT '',
    centrosdesalud TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de registro
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de la última edición
);

-- Crear función para actualizar la fecha de modificación
CREATE OR REPLACE FUNCTION citas.actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar fecha de modificación antes de un UPDATE
CREATE TRIGGER actualizar_fecha_modificacion_trigger
BEFORE UPDATE ON citas.interacciones
FOR EACH ROW
EXECUTE FUNCTION citas.actualizar_fecha_modificacion();
