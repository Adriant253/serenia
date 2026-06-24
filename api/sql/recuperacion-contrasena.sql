-- Columnas para tokens de recuperación de contraseña
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS token_recuperacion VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS token_expira DATETIME NULL;

DROP PROCEDURE IF EXISTS spSolicitarRecuperacionContrasena;

DELIMITER $$

CREATE PROCEDURE spSolicitarRecuperacionContrasena(
  IN p_email VARCHAR(150),
  IN p_token VARCHAR(20)
)
BEGIN
  DECLARE v_id INT UNSIGNED DEFAULT NULL;

  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    SELECT
      0 AS success,
      'Ingresa un correo electrónico válido' AS mensaje;
  ELSE
    SELECT id_usuario
    INTO v_id
    FROM usuarios
    WHERE LOWER(email) = LOWER(TRIM(p_email))
    LIMIT 1;

    IF v_id IS NULL THEN
      SELECT
        0 AS success,
        'No existe una cuenta registrada con ese correo' AS mensaje;
    ELSE
      UPDATE usuarios
      SET
        token_recuperacion = p_token,
        token_expira = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
      WHERE id_usuario = v_id;

      SELECT
        1 AS success,
        'Se envió un código de recuperación a tu correo' AS mensaje;
    END IF;
  END IF;
END$$

DROP PROCEDURE IF EXISTS spCambiarContrasena$$

CREATE PROCEDURE spCambiarContrasena(
  IN p_email VARCHAR(150),
  IN p_token VARCHAR(20),
  IN p_nueva_contrasena VARCHAR(255)
)
BEGIN
  DECLARE v_id INT UNSIGNED DEFAULT NULL;
  DECLARE v_token_guardado VARCHAR(20) DEFAULT NULL;
  DECLARE v_token_expira DATETIME DEFAULT NULL;

  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    SELECT
      0 AS success,
      'Correo no válido' AS mensaje;
  ELSEIF p_token IS NULL OR TRIM(p_token) = '' THEN
    SELECT
      0 AS success,
      'Ingresa el token de recuperación' AS mensaje;
  ELSEIF p_nueva_contrasena IS NULL OR TRIM(p_nueva_contrasena) = '' THEN
    SELECT
      0 AS success,
      'Ingresa una nueva contraseña' AS mensaje;
  ELSEIF LENGTH(TRIM(p_nueva_contrasena)) < 8 THEN
    SELECT
      0 AS success,
      'La contraseña debe tener mínimo 8 caracteres' AS mensaje;
  ELSE
    SELECT
      id_usuario,
      token_recuperacion,
      token_expira
    INTO
      v_id,
      v_token_guardado,
      v_token_expira
    FROM usuarios
    WHERE LOWER(email) = LOWER(TRIM(p_email))
    LIMIT 1;

    IF v_id IS NULL THEN
      SELECT
        0 AS success,
        'No existe una cuenta con ese correo' AS mensaje;
    ELSEIF v_token_guardado IS NULL OR v_token_expira IS NULL THEN
      SELECT
        0 AS success,
        'No hay una solicitud de recuperación activa' AS mensaje;
    ELSEIF v_token_expira < NOW() THEN
      SELECT
        0 AS success,
        'El token ha expirado. Solicita uno nuevo' AS mensaje;
    ELSEIF UPPER(TRIM(v_token_guardado)) <> UPPER(TRIM(p_token)) THEN
      SELECT
        0 AS success,
        'El token no es válido' AS mensaje;
    ELSE
      UPDATE usuarios
      SET
        contrasena = p_nueva_contrasena,
        token_recuperacion = NULL,
        token_expira = NULL
      WHERE id_usuario = v_id;

      SELECT
        1 AS success,
        'Contraseña actualizada correctamente' AS mensaje;
    END IF;
  END IF;
END$$

DELIMITER ;
