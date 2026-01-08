CREATE OR REPLACE FUNCTION citas.sp_crear_interaccion(
	p_cod_red TEXT,
	p_cod_ses TEXT,
    p_id_whats TEXT,    
	p_name_whats TEXT,
    p_number_phone TEXT,
    p_mensaje_interaccion TEXT,
    p_fecha_interaccion TEXT
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    -- Insertar los datos en la tabla interacciones
    INSERT INTO citas.interacciones (
		cod_red,
		cod_ses,
        name_whats,
        id_whats,
        number_phone,
        mensaje_interaccion,
        fecha_interaccion
    ) VALUES (
		p_cod_red,
		p_cod_ses,
        p_name_whats,
        p_id_whats,
        p_number_phone,
        p_mensaje_interaccion,
        p_fecha_interaccion
    ) 
    RETURNING jsonb_build_object(
        'estado', 'success',
        'codigo', 201,  -- 201 Created
        'mensaje', 'Interacción creada correctamente'
    ) INTO v_result;

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'estado', 'error',
            'codigo', 500,  -- 500 Internal Server Error
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

---

CREATE OR REPLACE FUNCTION citas.sp_guardar_opciones(
    p_id_whats TEXT, 
    p_option TEXT, 
    p_campo TEXT
) RETURNS JSONB AS $$
DECLARE
    filas_actualizadas INT;
BEGIN
    -- Usar EXECUTE para realizar la actualización dinámica de la columna y contar las filas actualizadas
    EXECUTE format('
        UPDATE citas.interacciones
        SET %I = CASE 
                     WHEN %I IS NULL THEN ARRAY[$1] 
                     ELSE %I || $1 
                  END
        WHERE id_whats = $2
        RETURNING 1
    ', p_campo, p_campo, p_campo)
    INTO filas_actualizadas
    USING p_option, p_id_whats;

    -- Verificar si se actualizó alguna fila
    IF filas_actualizadas IS NOT NULL THEN
        RETURN jsonb_build_object(
            'estado', 'success',
            'codigo', 200, -- 200 OK
            'mensaje', 'Opción guardada correctamente'
        );
    ELSE
        RETURN jsonb_build_object(
            'estado', 'error',
            'codigo', 404, -- 404 Not Found
            'mensaje', 'No se encontró al usuario con el ID: ' || p_id_whats
        );
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'estado', 'error',
            'codigo', 500, -- 500 Internal Server Error
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

---

CREATE OR REPLACE FUNCTION citas.sp_guardar_informacion(
    p_id_whats TEXT, 
    p_option TEXT, 
    p_campo TEXT
) RETURNS JSONB AS $$
DECLARE
    filas_actualizadas INT;
    tipo_columna TEXT;
BEGIN
    -- Obtener el tipo de la columna para validar y convertir `p_option` si es necesario
    SELECT data_type INTO tipo_columna
    FROM information_schema.columns
    WHERE table_name = 'interacciones'
      AND table_schema = 'citas'
      AND column_name = p_campo;

    -- Realizar la actualización dinámica de acuerdo al tipo de columna
    IF tipo_columna = 'boolean' THEN
        EXECUTE format('
            UPDATE citas.interacciones
            SET %I = $1::BOOLEAN
            WHERE id_whats = $2
            RETURNING 1
        ', p_campo)
        INTO filas_actualizadas
        USING p_option::BOOLEAN, p_id_whats;

    ELSIF tipo_columna = 'bigint' THEN
        EXECUTE format('
            UPDATE citas.interacciones
            SET %I = $1::BIGINT
            WHERE id_whats = $2
            RETURNING 1
        ', p_campo)
        INTO filas_actualizadas
        USING p_option::BIGINT, p_id_whats;

    ELSIF tipo_columna = 'integer' THEN
        EXECUTE format('
            UPDATE citas.interacciones
            SET %I = $1::INTEGER
            WHERE id_whats = $2
            RETURNING 1
        ', p_campo)
        INTO filas_actualizadas
        USING p_option::INTEGER, p_id_whats;

    ELSIF tipo_columna = 'timestamp without time zone' THEN
        EXECUTE format('
            UPDATE citas.interacciones
            SET %I = $1::TIMESTAMP
            WHERE id_whats = $2
            RETURNING 1
        ', p_campo)
        INTO filas_actualizadas
        USING p_option::TIMESTAMP, p_id_whats;

    ELSE
        -- Para TEXT, VARCHAR, y otros tipos no especificados
        EXECUTE format('
            UPDATE citas.interacciones
            SET %I = $1
            WHERE id_whats = $2
            RETURNING 1
        ', p_campo)
        INTO filas_actualizadas
        USING p_option, p_id_whats;
    END IF;

    -- Verificar si se actualizó alguna fila
    IF filas_actualizadas IS NOT NULL THEN
        RETURN jsonb_build_object(
            'estado', 'success',
            'codigo', 200, -- 200 OK
            'mensaje', 'Información guardada correctamente'
        );
    ELSE
        RETURN jsonb_build_object(
            'estado', 'error',
            'codigo', 404, -- 404 Not Found
            'mensaje', 'No se encontró al usuario con el ID proporcionado'
        );
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'estado', 'error',
            'codigo', 500, -- 500 Internal Server Error
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

--