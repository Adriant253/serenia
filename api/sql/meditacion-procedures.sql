/*
|--------------------------------------------------------------------------
| MÓDULO DE MEDITACIÓN
|--------------------------------------------------------------------------
|
| Este archivo:
|
| 1. Migra el historial antiguo de meditación.
| 2. Descarta registros y columnas de audio guiado.
| 3. Crea el control de sesiones Free.
| 4. Crea los procedimientos almacenados del módulo.
|
| Se conserva únicamente:
|
| - Temporizador
| - Historial del temporizador
|
| La Guía de meditación es contenido local del frontend
| y no necesita tablas.
|
*/

SET NAMES utf8mb4;


/*
|--------------------------------------------------------------------------
| MIGRACIÓN DE LA ESTRUCTURA
|--------------------------------------------------------------------------
|
| Esta migración permite dos situaciones:
|
| 1. La tabla historial_meditaciones todavía tiene la estructura antigua.
| 2. La tabla todavía no existe.
|
| Si ya tiene la estructura nueva, no vuelve a transformarla.
|
*/

DROP PROCEDURE IF EXISTS spPrepararEstructuraMeditacion;

DELIMITER $$

CREATE PROCEDURE spPrepararEstructuraMeditacion()
preparar: BEGIN

    DECLARE v_existe_historial INT DEFAULT 0;
    DECLARE v_tiene_tipo_antiguo INT DEFAULT 0;
    DECLARE v_tiene_duracion_nueva INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_existe_historial
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'historial_meditaciones';

    /*
    |--------------------------------------------------------------------------
    | LA TABLA NO EXISTE
    |--------------------------------------------------------------------------
    */

    IF v_existe_historial = 0 THEN

        CREATE TABLE historial_meditaciones (
            id_meditacion INT UNSIGNED
                NOT NULL
                AUTO_INCREMENT,

            duracion_programada_segundos INT UNSIGNED
                NOT NULL,

            duracion_real_segundos INT UNSIGNED
                NOT NULL,

            completado TINYINT(1)
                NOT NULL
                DEFAULT 1,

            fecha_inicio DATETIME
                NOT NULL,

            fecha_fin DATETIME
                NOT NULL,

            Usuarios_id_usuario INT UNSIGNED
                NOT NULL,

            PRIMARY KEY (
                id_meditacion
            ),

            KEY idx_historial_meditacion_usuario (
                Usuarios_id_usuario
            ),

            KEY idx_historial_meditacion_fecha (
                fecha_fin
            ),

            KEY idx_historial_meditacion_usuario_fecha (
                Usuarios_id_usuario,
                fecha_fin
            ),

            CONSTRAINT fk_historial_meditaciones_usuario
                FOREIGN KEY (
                    Usuarios_id_usuario
                )
                REFERENCES usuarios (
                    id_usuario
                )
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        ENGINE = InnoDB
        DEFAULT CHARSET = utf8mb4
        COLLATE = utf8mb4_general_ci;

    ELSE

        /*
        |--------------------------------------------------------------------------
        | COMPROBAR SI ES LA ESTRUCTURA ANTIGUA
        |--------------------------------------------------------------------------
        */

        SELECT COUNT(*)
        INTO v_tiene_tipo_antiguo
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'historial_meditaciones'
          AND column_name = 'tipo_meditacion';

        SELECT COUNT(*)
        INTO v_tiene_duracion_nueva
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'historial_meditaciones'
          AND column_name = 'duracion_programada_segundos';

        /*
        |--------------------------------------------------------------------------
        | MIGRAR LA TABLA ANTIGUA
        |--------------------------------------------------------------------------
        */

        IF v_tiene_tipo_antiguo > 0 THEN

            DROP TABLE IF EXISTS historial_meditaciones_nueva;

            CREATE TABLE historial_meditaciones_nueva (
                id_meditacion INT UNSIGNED
                    NOT NULL
                    AUTO_INCREMENT,

                duracion_programada_segundos INT UNSIGNED
                    NOT NULL,

                duracion_real_segundos INT UNSIGNED
                    NOT NULL,

                completado TINYINT(1)
                    NOT NULL
                    DEFAULT 1,

                fecha_inicio DATETIME
                    NOT NULL,

                fecha_fin DATETIME
                    NOT NULL,

                Usuarios_id_usuario INT UNSIGNED
                    NOT NULL,

                PRIMARY KEY (
                    id_meditacion
                )
            )
            ENGINE = InnoDB
            DEFAULT CHARSET = utf8mb4
            COLLATE = utf8mb4_general_ci;

            /*
            |--------------------------------------------------------------
            | CONSERVAR SOLO TEMPORIZADORES
            |--------------------------------------------------------------
            |
            | En los registros antiguos no existía una diferencia clara
            | entre duración programada y duración real.
            |
            | Por ello, para los registros migrados se utiliza el mismo
            | valor en ambas columnas.
            |
            */

            INSERT INTO historial_meditaciones_nueva (
                id_meditacion,
                duracion_programada_segundos,
                duracion_real_segundos,
                completado,
                fecha_inicio,
                fecha_fin,
                Usuarios_id_usuario
            )
            SELECT
                id_meditacion,
                GREATEST(
                    IFNULL(
                        duracion_segundos,
                        1
                    ),
                    1
                ),
                GREATEST(
                    IFNULL(
                        duracion_segundos,
                        1
                    ),
                    1
                ),
                CASE
                    WHEN completado = 1
                    THEN 1
                    ELSE 0
                END,
                fecha_inicio,
                fecha_fin,
                Usuarios_id_usuario
            FROM historial_meditaciones
            WHERE tipo_meditacion = 'temporizador';

            /*
            |--------------------------------------------------------------
            | REEMPLAZAR TABLA ANTIGUA
            |--------------------------------------------------------------
            */

            DROP TABLE historial_meditaciones;

            RENAME TABLE
                historial_meditaciones_nueva
            TO
                historial_meditaciones;

            ALTER TABLE historial_meditaciones
                ADD KEY idx_historial_meditacion_usuario (
                    Usuarios_id_usuario
                ),

                ADD KEY idx_historial_meditacion_fecha (
                    fecha_fin
                ),

                ADD KEY idx_historial_meditacion_usuario_fecha (
                    Usuarios_id_usuario,
                    fecha_fin
                ),

                ADD CONSTRAINT fk_historial_meditaciones_usuario
                    FOREIGN KEY (
                        Usuarios_id_usuario
                    )
                    REFERENCES usuarios (
                        id_usuario
                    )
                    ON DELETE CASCADE
                    ON UPDATE CASCADE;

        ELSEIF v_tiene_duracion_nueva = 0 THEN

            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'La tabla historial_meditaciones tiene una estructura no reconocida';

        END IF;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | CONTROL DE SESIONES FREE
    |--------------------------------------------------------------------------
    */

    CREATE TABLE IF NOT EXISTS control_meditacion_free (
        Usuarios_id_usuario INT UNSIGNED
            NOT NULL,

        sesiones_utilizadas TINYINT UNSIGNED
            NOT NULL
            DEFAULT 0,

        fecha_bloqueo DATETIME
            DEFAULT NULL,

        fecha_desbloqueo DATETIME
            DEFAULT NULL,

        fecha_actualizacion TIMESTAMP
            NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (
            Usuarios_id_usuario
        ),

        KEY idx_control_meditacion_desbloqueo (
            fecha_desbloqueo
        ),

        CONSTRAINT fk_control_meditacion_usuario
            FOREIGN KEY (
                Usuarios_id_usuario
            )
            REFERENCES usuarios (
                id_usuario
            )
            ON DELETE CASCADE
            ON UPDATE CASCADE
    )
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_general_ci;


    /*
    |--------------------------------------------------------------------------
    | CREAR CONTROL INICIAL PARA USUARIOS FREE EXISTENTES
    |--------------------------------------------------------------------------
    */

    INSERT IGNORE INTO control_meditacion_free (
        Usuarios_id_usuario,
        sesiones_utilizadas,
        fecha_bloqueo,
        fecha_desbloqueo
    )
    SELECT
        id_usuario,
        0,
        NULL,
        NULL
    FROM usuarios
    WHERE LOWER(
        TRIM(
            IFNULL(
                estado_suscripcion,
                'free'
            )
        )
    ) <> 'premium';

END$$

DELIMITER ;

CALL spPrepararEstructuraMeditacion();

DROP PROCEDURE IF EXISTS spPrepararEstructuraMeditacion;


/*
|--------------------------------------------------------------------------
| OBTENER ESTADO DEL TEMPORIZADOR
|--------------------------------------------------------------------------
|
| Devuelve:
|
| - Plan del usuario.
| - Sesiones utilizadas.
| - Sesiones disponibles.
| - Estado de bloqueo.
| - Fecha de desbloqueo.
| - Segundos restantes.
|
| Si el bloqueo ya terminó, restaura automáticamente las tres sesiones.
|
*/

DELIMITER $$

CREATE PROCEDURE spObtenerEstadoMeditacion(
    IN p_Usuarios_id_usuario INT UNSIGNED
)
estado: BEGIN

    DECLARE v_existe_usuario INT DEFAULT 0;
    DECLARE v_estado_suscripcion VARCHAR(20) DEFAULT 'free';

    DECLARE v_sesiones_utilizadas INT DEFAULT 0;
    DECLARE v_sesiones_disponibles INT DEFAULT 3;

    DECLARE v_fecha_bloqueo DATETIME DEFAULT NULL;
    DECLARE v_fecha_desbloqueo DATETIME DEFAULT NULL;

    DECLARE v_esta_bloqueado TINYINT DEFAULT 0;
    DECLARE v_segundos_desbloqueo INT DEFAULT 0;


    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES
    |--------------------------------------------------------------------------
    */

    IF (
        p_Usuarios_id_usuario IS NULL OR
        p_Usuarios_id_usuario <= 0
    ) THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario es obligatorio' AS mensaje;

        LEAVE estado;

    END IF;


    SELECT
        COUNT(*),
        COALESCE(
            MAX(
                LOWER(
                    TRIM(
                        IFNULL(
                            estado_suscripcion,
                            'free'
                        )
                    )
                )
            ),
            'free'
        )
    INTO
        v_existe_usuario,
        v_estado_suscripcion
    FROM usuarios
    WHERE id_usuario =
        p_Usuarios_id_usuario;


    IF v_existe_usuario = 0 THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario no existe' AS mensaje;

        LEAVE estado;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | USUARIO PREMIUM
    |--------------------------------------------------------------------------
    */

    IF v_estado_suscripcion = 'premium' THEN

        SELECT
            1 AS success,
            NULL AS campo,
            'Estado de meditación obtenido correctamente' AS mensaje,

            'premium' AS estado_suscripcion,
            1 AS es_premium,

            NULL AS sesiones_utilizadas,
            NULL AS sesiones_disponibles,
            NULL AS limite_sesiones,

            0 AS esta_bloqueado,

            NULL AS fecha_bloqueo,
            NULL AS fecha_desbloqueo,

            0 AS segundos_para_desbloqueo;

        LEAVE estado;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | USUARIO FREE
    |--------------------------------------------------------------------------
    */

    INSERT IGNORE INTO control_meditacion_free (
        Usuarios_id_usuario,
        sesiones_utilizadas,
        fecha_bloqueo,
        fecha_desbloqueo
    )
    VALUES (
        p_Usuarios_id_usuario,
        0,
        NULL,
        NULL
    );


    /*
    |--------------------------------------------------------------------------
    | RESTAURAR SESIONES CUANDO TERMINÓ EL BLOQUEO
    |--------------------------------------------------------------------------
    */

    UPDATE control_meditacion_free
    SET
        sesiones_utilizadas = 0,
        fecha_bloqueo = NULL,
        fecha_desbloqueo = NULL
    WHERE Usuarios_id_usuario =
            p_Usuarios_id_usuario
      AND fecha_desbloqueo IS NOT NULL
      AND fecha_desbloqueo <= NOW();


    SELECT
        sesiones_utilizadas,
        fecha_bloqueo,
        fecha_desbloqueo
    INTO
        v_sesiones_utilizadas,
        v_fecha_bloqueo,
        v_fecha_desbloqueo
    FROM control_meditacion_free
    WHERE Usuarios_id_usuario =
        p_Usuarios_id_usuario;


    /*
    |--------------------------------------------------------------------------
    | CORREGIR UN CONTROL INCONSISTENTE
    |--------------------------------------------------------------------------
    |
    | Si aparecen tres sesiones utilizadas sin fecha de desbloqueo,
    | se inicia el bloqueo en ese momento.
    |
    */

    IF (
        v_sesiones_utilizadas >= 3 AND
        v_fecha_desbloqueo IS NULL
    ) THEN

        SET v_fecha_bloqueo =
            NOW();

        SET v_fecha_desbloqueo =
            DATE_ADD(
                NOW(),
                INTERVAL 30 MINUTE
            );

        UPDATE control_meditacion_free
        SET
            sesiones_utilizadas = 3,
            fecha_bloqueo =
                v_fecha_bloqueo,
            fecha_desbloqueo =
                v_fecha_desbloqueo
        WHERE Usuarios_id_usuario =
            p_Usuarios_id_usuario;

        SET v_sesiones_utilizadas = 3;

    END IF;


    SET v_sesiones_disponibles =
        GREATEST(
            0,
            3 - v_sesiones_utilizadas
        );


    IF (
        v_sesiones_utilizadas >= 3 AND
        v_fecha_desbloqueo IS NOT NULL AND
        v_fecha_desbloqueo > NOW()
    ) THEN

        SET v_esta_bloqueado = 1;

        SET v_segundos_desbloqueo =
            GREATEST(
                0,
                TIMESTAMPDIFF(
                    SECOND,
                    NOW(),
                    v_fecha_desbloqueo
                )
            );

    ELSE

        SET v_esta_bloqueado = 0;
        SET v_segundos_desbloqueo = 0;

    END IF;


    SELECT
        1 AS success,
        NULL AS campo,
        'Estado de meditación obtenido correctamente' AS mensaje,

        'free' AS estado_suscripcion,
        0 AS es_premium,

        v_sesiones_utilizadas AS sesiones_utilizadas,
        v_sesiones_disponibles AS sesiones_disponibles,
        3 AS limite_sesiones,

        v_esta_bloqueado AS esta_bloqueado,

        v_fecha_bloqueo AS fecha_bloqueo,
        v_fecha_desbloqueo AS fecha_desbloqueo,

        v_segundos_desbloqueo AS segundos_para_desbloqueo;

END$$

DELIMITER ;


/*
|--------------------------------------------------------------------------
| GUARDAR SESIÓN DEL TEMPORIZADOR
|--------------------------------------------------------------------------
|
| Reglas:
|
| FREE:
| - Duraciones permitidas: 30 y 60 segundos.
| - Máximo tres sesiones.
| - Después de la tercera sesión se bloquea 30 minutos.
|
| PREMIUM:
| - Duraciones permitidas: 30, 60, 120, 180 y 300 segundos.
| - Sin límite de sesiones.
|
*/

DELIMITER $$

CREATE PROCEDURE spGuardarMeditacionTemporizador(
    IN p_duracion_programada_segundos INT,
    IN p_duracion_real_segundos INT,
    IN p_completado TINYINT,

    IN p_fecha_inicio DATETIME,
    IN p_fecha_fin DATETIME,

    IN p_Usuarios_id_usuario INT UNSIGNED
)
guardar: BEGIN

    DECLARE v_existe_usuario INT DEFAULT 0;
    DECLARE v_estado_suscripcion VARCHAR(20) DEFAULT 'free';

    DECLARE v_sesiones_utilizadas INT DEFAULT 0;
    DECLARE v_nuevas_sesiones_utilizadas INT DEFAULT 0;
    DECLARE v_sesiones_disponibles INT DEFAULT 0;

    DECLARE v_fecha_bloqueo DATETIME DEFAULT NULL;
    DECLARE v_fecha_desbloqueo DATETIME DEFAULT NULL;

    DECLARE v_esta_bloqueado TINYINT DEFAULT 0;
    DECLARE v_segundos_desbloqueo INT DEFAULT 0;

    DECLARE v_id_meditacion INT UNSIGNED DEFAULT 0;


    /*
    |--------------------------------------------------------------------------
    | MANEJO DE ERRORES SQL
    |--------------------------------------------------------------------------
    */

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;


    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES GENERALES
    |--------------------------------------------------------------------------
    */

    IF (
        p_Usuarios_id_usuario IS NULL OR
        p_Usuarios_id_usuario <= 0
    ) THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario es obligatorio' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF (
        p_duracion_programada_segundos IS NULL OR
        p_duracion_programada_segundos NOT IN (
            30,
            60,
            120,
            180,
            300
        )
    ) THEN

        SELECT
            0 AS success,
            'duracion_programada_segundos' AS campo,
            'La duración seleccionada no es válida' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF (
        p_duracion_real_segundos IS NULL OR
        p_duracion_real_segundos <= 0
    ) THEN

        SELECT
            0 AS success,
            'duracion_real_segundos' AS campo,
            'El tiempo meditado debe ser mayor a cero' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF (
        p_duracion_real_segundos >
        p_duracion_programada_segundos
    ) THEN

        SELECT
            0 AS success,
            'duracion_real_segundos' AS campo,
            'El tiempo meditado no puede superar la duración seleccionada' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF (
        p_completado IS NULL OR
        p_completado NOT IN (
            0,
            1
        )
    ) THEN

        SELECT
            0 AS success,
            'completado' AS campo,
            'El estado de la sesión no es válido' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF (
        p_completado = 1 AND
        p_duracion_real_segundos <>
        p_duracion_programada_segundos
    ) THEN

        SELECT
            0 AS success,
            'completado' AS campo,
            'Una sesión completada debe alcanzar la duración seleccionada' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF p_fecha_inicio IS NULL THEN

        SELECT
            0 AS success,
            'fecha_inicio' AS campo,
            'La fecha de inicio es obligatoria' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF p_fecha_fin IS NULL THEN

        SELECT
            0 AS success,
            'fecha_fin' AS campo,
            'La fecha de finalización es obligatoria' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    IF p_fecha_fin < p_fecha_inicio THEN

        SELECT
            0 AS success,
            'fecha_fin' AS campo,
            'La fecha final no puede ser menor a la fecha inicial' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | COMPROBAR USUARIO
    |--------------------------------------------------------------------------
    */

    SELECT
        COUNT(*)
    INTO
        v_existe_usuario
    FROM usuarios
    WHERE id_usuario =
        p_Usuarios_id_usuario;


    IF v_existe_usuario = 0 THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario no existe' AS mensaje,
            NULL AS id_meditacion;

        LEAVE guardar;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | INICIAR TRANSACCIÓN
    |--------------------------------------------------------------------------
    */

    START TRANSACTION;


    SELECT
        LOWER(
            TRIM(
                IFNULL(
                    estado_suscripcion,
                    'free'
                )
            )
        )
    INTO
        v_estado_suscripcion
    FROM usuarios
    WHERE id_usuario =
        p_Usuarios_id_usuario
    FOR UPDATE;


    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES FREE
    |--------------------------------------------------------------------------
    */

    IF v_estado_suscripcion <> 'premium' THEN

        IF p_duracion_programada_segundos NOT IN (
            30,
            60
        ) THEN

            ROLLBACK;

            SELECT
                0 AS success,
                'duracion_programada_segundos' AS campo,
                'El plan Free permite sesiones de 30 segundos o 1 minuto' AS mensaje,
                NULL AS id_meditacion;

            LEAVE guardar;

        END IF;


        INSERT IGNORE INTO control_meditacion_free (
            Usuarios_id_usuario,
            sesiones_utilizadas,
            fecha_bloqueo,
            fecha_desbloqueo
        )
        VALUES (
            p_Usuarios_id_usuario,
            0,
            NULL,
            NULL
        );


        SELECT
            sesiones_utilizadas,
            fecha_bloqueo,
            fecha_desbloqueo
        INTO
            v_sesiones_utilizadas,
            v_fecha_bloqueo,
            v_fecha_desbloqueo
        FROM control_meditacion_free
        WHERE Usuarios_id_usuario =
            p_Usuarios_id_usuario
        FOR UPDATE;


        /*
        |------------------------------------------------------------------
        | RESTAURAR PERIODO VENCIDO
        |------------------------------------------------------------------
        */

        IF (
            v_fecha_desbloqueo IS NOT NULL AND
            v_fecha_desbloqueo <= NOW()
        ) THEN

            SET v_sesiones_utilizadas = 0;
            SET v_fecha_bloqueo = NULL;
            SET v_fecha_desbloqueo = NULL;

            UPDATE control_meditacion_free
            SET
                sesiones_utilizadas = 0,
                fecha_bloqueo = NULL,
                fecha_desbloqueo = NULL
            WHERE Usuarios_id_usuario =
                p_Usuarios_id_usuario;

        END IF;


        /*
        |------------------------------------------------------------------
        | BLOQUEAR SI YA UTILIZÓ LAS TRES SESIONES
        |------------------------------------------------------------------
        */

        IF v_sesiones_utilizadas >= 3 THEN

            IF v_fecha_desbloqueo IS NULL THEN

                SET v_fecha_bloqueo =
                    NOW();

                SET v_fecha_desbloqueo =
                    DATE_ADD(
                        NOW(),
                        INTERVAL 30 MINUTE
                    );

                UPDATE control_meditacion_free
                SET
                    sesiones_utilizadas = 3,
                    fecha_bloqueo =
                        v_fecha_bloqueo,
                    fecha_desbloqueo =
                        v_fecha_desbloqueo
                WHERE Usuarios_id_usuario =
                    p_Usuarios_id_usuario;

                COMMIT;

            ELSE

                ROLLBACK;

            END IF;


            SET v_segundos_desbloqueo =
                GREATEST(
                    0,
                    TIMESTAMPDIFF(
                        SECOND,
                        NOW(),
                        v_fecha_desbloqueo
                    )
                );


            SELECT
                0 AS success,
                'sesiones_free' AS campo,
                'Alcanzaste el límite de tres sesiones Free' AS mensaje,

                NULL AS id_meditacion,

                'free' AS estado_suscripcion,
                0 AS es_premium,

                3 AS sesiones_utilizadas,
                0 AS sesiones_disponibles,
                3 AS limite_sesiones,

                1 AS esta_bloqueado,

                v_fecha_bloqueo AS fecha_bloqueo,
                v_fecha_desbloqueo AS fecha_desbloqueo,

                v_segundos_desbloqueo AS segundos_para_desbloqueo;

            LEAVE guardar;

        END IF;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | GUARDAR HISTORIAL
    |--------------------------------------------------------------------------
    */

    INSERT INTO historial_meditaciones (
        duracion_programada_segundos,
        duracion_real_segundos,
        completado,
        fecha_inicio,
        fecha_fin,
        Usuarios_id_usuario
    )
    VALUES (
        p_duracion_programada_segundos,
        p_duracion_real_segundos,
        p_completado,
        p_fecha_inicio,
        p_fecha_fin,
        p_Usuarios_id_usuario
    );


    SET v_id_meditacion =
        LAST_INSERT_ID();


    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR CONTROL FREE
    |--------------------------------------------------------------------------
    */

    IF v_estado_suscripcion <> 'premium' THEN

        SET v_nuevas_sesiones_utilizadas =
            LEAST(
                3,
                v_sesiones_utilizadas + 1
            );


        IF v_nuevas_sesiones_utilizadas >= 3 THEN

            SET v_fecha_bloqueo =
                NOW();

            SET v_fecha_desbloqueo =
                DATE_ADD(
                    NOW(),
                    INTERVAL 30 MINUTE
                );

            SET v_esta_bloqueado = 1;

            SET v_segundos_desbloqueo =
                30 * 60;

        ELSE

            SET v_fecha_bloqueo = NULL;
            SET v_fecha_desbloqueo = NULL;

            SET v_esta_bloqueado = 0;
            SET v_segundos_desbloqueo = 0;

        END IF;


        UPDATE control_meditacion_free
        SET
            sesiones_utilizadas =
                v_nuevas_sesiones_utilizadas,

            fecha_bloqueo =
                v_fecha_bloqueo,

            fecha_desbloqueo =
                v_fecha_desbloqueo
        WHERE Usuarios_id_usuario =
            p_Usuarios_id_usuario;


        SET v_sesiones_disponibles =
            GREATEST(
                0,
                3 -
                v_nuevas_sesiones_utilizadas
            );

    END IF;


    COMMIT;


    /*
    |--------------------------------------------------------------------------
    | RESPUESTA PREMIUM
    |--------------------------------------------------------------------------
    */

    IF v_estado_suscripcion = 'premium' THEN

        SELECT
            1 AS success,
            NULL AS campo,
            'Sesión de meditación guardada correctamente' AS mensaje,

            v_id_meditacion AS id_meditacion,

            'premium' AS estado_suscripcion,
            1 AS es_premium,

            NULL AS sesiones_utilizadas,
            NULL AS sesiones_disponibles,
            NULL AS limite_sesiones,

            0 AS esta_bloqueado,

            NULL AS fecha_bloqueo,
            NULL AS fecha_desbloqueo,

            0 AS segundos_para_desbloqueo;

        LEAVE guardar;

    END IF;


    /*
    |--------------------------------------------------------------------------
    | RESPUESTA FREE
    |--------------------------------------------------------------------------
    */

    SELECT
        1 AS success,
        NULL AS campo,
        'Sesión de meditación guardada correctamente' AS mensaje,

        v_id_meditacion AS id_meditacion,

        'free' AS estado_suscripcion,
        0 AS es_premium,

        v_nuevas_sesiones_utilizadas AS sesiones_utilizadas,
        v_sesiones_disponibles AS sesiones_disponibles,
        3 AS limite_sesiones,

        v_esta_bloqueado AS esta_bloqueado,

        v_fecha_bloqueo AS fecha_bloqueo,
        v_fecha_desbloqueo AS fecha_desbloqueo,

        v_segundos_desbloqueo AS segundos_para_desbloqueo;

END$$

DELIMITER ;


/*
|--------------------------------------------------------------------------
| OBTENER HISTORIAL PREMIUM
|--------------------------------------------------------------------------
*/

DELIMITER $$

CREATE PROCEDURE spObtenerHistorialMeditaciones(
    IN p_Usuarios_id_usuario INT UNSIGNED
)
historial: BEGIN

    DECLARE v_existe_usuario INT DEFAULT 0;
    DECLARE v_estado_suscripcion VARCHAR(20) DEFAULT 'free';


    IF (
        p_Usuarios_id_usuario IS NULL OR
        p_Usuarios_id_usuario <= 0
    ) THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario es obligatorio' AS mensaje;

        LEAVE historial;

    END IF;


    SELECT
        COUNT(*),
        COALESCE(
            MAX(
                LOWER(
                    TRIM(
                        IFNULL(
                            estado_suscripcion,
                            'free'
                        )
                    )
                )
            ),
            'free'
        )
    INTO
        v_existe_usuario,
        v_estado_suscripcion
    FROM usuarios
    WHERE id_usuario =
        p_Usuarios_id_usuario;


    IF v_existe_usuario = 0 THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario no existe' AS mensaje;

        LEAVE historial;

    END IF;


    IF v_estado_suscripcion <> 'premium' THEN

        SELECT
            0 AS success,
            'estado_suscripcion' AS campo,
            'El historial completo está disponible únicamente para usuarios Premium' AS mensaje,
            1 AS requiere_premium;

        LEAVE historial;

    END IF;


    SELECT
        id_meditacion,
        duracion_programada_segundos,
        duracion_real_segundos,
        completado,
        fecha_inicio,
        fecha_fin,
        Usuarios_id_usuario
    FROM historial_meditaciones
    WHERE Usuarios_id_usuario =
        p_Usuarios_id_usuario
    ORDER BY
        fecha_fin DESC,
        id_meditacion DESC;

END$$

DELIMITER ;


/*
|--------------------------------------------------------------------------
| ELIMINAR REGISTRO DEL HISTORIAL
|--------------------------------------------------------------------------
*/

DELIMITER $$

CREATE PROCEDURE spEliminarMeditacionHistorial(
    IN p_id_meditacion INT UNSIGNED,
    IN p_Usuarios_id_usuario INT UNSIGNED
)
eliminar: BEGIN

    DECLARE v_existe_usuario INT DEFAULT 0;
    DECLARE v_existe_registro INT DEFAULT 0;

    DECLARE v_estado_suscripcion VARCHAR(20) DEFAULT 'free';


    IF (
        p_id_meditacion IS NULL OR
        p_id_meditacion <= 0
    ) THEN

        SELECT
            0 AS success,
            'id_meditacion' AS campo,
            'El registro de meditación es obligatorio' AS mensaje;

        LEAVE eliminar;

    END IF;


    IF (
        p_Usuarios_id_usuario IS NULL OR
        p_Usuarios_id_usuario <= 0
    ) THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario es obligatorio' AS mensaje;

        LEAVE eliminar;

    END IF;


    SELECT
        COUNT(*),
        COALESCE(
            MAX(
                LOWER(
                    TRIM(
                        IFNULL(
                            estado_suscripcion,
                            'free'
                        )
                    )
                )
            ),
            'free'
        )
    INTO
        v_existe_usuario,
        v_estado_suscripcion
    FROM usuarios
    WHERE id_usuario =
        p_Usuarios_id_usuario;


    IF v_existe_usuario = 0 THEN

        SELECT
            0 AS success,
            'Usuarios_id_usuario' AS campo,
            'El usuario no existe' AS mensaje;

        LEAVE eliminar;

    END IF;


    IF v_estado_suscripcion <> 'premium' THEN

        SELECT
            0 AS success,
            'estado_suscripcion' AS campo,
            'La eliminación del historial está disponible únicamente para usuarios Premium' AS mensaje,
            1 AS requiere_premium;

        LEAVE eliminar;

    END IF;


    SELECT COUNT(*)
    INTO v_existe_registro
    FROM historial_meditaciones
    WHERE id_meditacion =
            p_id_meditacion
      AND Usuarios_id_usuario =
            p_Usuarios_id_usuario;


    IF v_existe_registro = 0 THEN

        SELECT
            0 AS success,
            'id_meditacion' AS campo,
            'No se encontró el registro o no pertenece al usuario' AS mensaje;

        LEAVE eliminar;

    END IF;


    DELETE FROM historial_meditaciones
    WHERE id_meditacion =
            p_id_meditacion
      AND Usuarios_id_usuario =
            p_Usuarios_id_usuario;


    SELECT
        1 AS success,
        NULL AS campo,
        'Registro de meditación eliminado correctamente' AS mensaje,
        p_id_meditacion AS id_meditacion;

END$$

DELIMITER ;