CREATE TABLE public.interacciones (
    id SERIAL PRIMARY KEY,
    cod_red TEXT NOT NULL,
    cod_ses TEXT NOT NULL,
    id_whats TEXT NOT NULL DEFAULT '',
    name_whats TEXT NOT NULL DEFAULT '',
    number_phone TEXT NOT NULL DEFAULT '',
    mensaje_interaccion TEXT NOT NULL DEFAULT '',
    fecha_interaccion TEXT NOT NULL DEFAULT '',
    mensaje_menu TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array de cadenas de texto
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de registro
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de la última edición
);

-- Crear función para actualizar la fecha de modificación
CREATE OR REPLACE FUNCTION public.actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar fecha de modificación antes de un UPDATE
CREATE TRIGGER actualizar_fecha_modificacion_trigger
BEFORE UPDATE ON public.interacciones
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_fecha_modificacion();
