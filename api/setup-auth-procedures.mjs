import pool from './db.js'

const crearLogin = `
CREATE PROCEDURE spLoginUsuario(
  IN p_email VARCHAR(150),
  IN p_contrasena VARCHAR(255)
)
BEGIN
  DECLARE v_id INT UNSIGNED DEFAULT NULL;

  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    SELECT
      0 AS success,
      'email' AS campo,
      'Ingresa tu correo electrónico' AS mensaje,
      NULL AS id_usuario,
      NULL AS nombre,
      NULL AS email,
      NULL AS estado_suscripcion,
      NULL AS fecha_nacimiento,
      NULL AS fecha_registro;
  ELSEIF p_contrasena IS NULL OR TRIM(p_contrasena) = '' THEN
    SELECT
      0 AS success,
      'contrasena' AS campo,
      'Ingresa tu contraseña' AS mensaje,
      NULL AS id_usuario,
      NULL AS nombre,
      NULL AS email,
      NULL AS estado_suscripcion,
      NULL AS fecha_nacimiento,
      NULL AS fecha_registro;
  ELSE
    SELECT id_usuario INTO v_id
    FROM usuarios
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email))
    LIMIT 1;

    IF v_id IS NULL THEN
      SELECT
        0 AS success,
        'email' AS campo,
        'No encontramos una cuenta con ese correo. Revisa que esté bien escrito.' AS mensaje,
        NULL AS id_usuario,
        NULL AS nombre,
        NULL AS email,
        NULL AS estado_suscripcion,
        NULL AS fecha_nacimiento,
        NULL AS fecha_registro;
    ELSEIF NOT EXISTS (
      SELECT 1 FROM usuarios
      WHERE id_usuario = v_id
        AND contrasena = p_contrasena
    ) THEN
      SELECT
        0 AS success,
        'contrasena' AS campo,
        'La contraseña no es correcta. Vuelve a intentarlo.' AS mensaje,
        NULL AS id_usuario,
        NULL AS nombre,
        NULL AS email,
        NULL AS estado_suscripcion,
        NULL AS fecha_nacimiento,
        NULL AS fecha_registro;
    ELSE
      SELECT
        1 AS success,
        NULL AS campo,
        'Inicio de sesión correcto' AS mensaje,
        id_usuario,
        nombre,
        email,
        estado_suscripcion,
        fecha_nacimiento,
        fecha_registro
      FROM usuarios
      WHERE id_usuario = v_id
      LIMIT 1;
    END IF;
  END IF;
END
`

const crearRegistro = `
CREATE PROCEDURE spRegistrarUsuario(
  IN p_nombre VARCHAR(100),
  IN p_email VARCHAR(150),
  IN p_contrasena VARCHAR(255),
  IN p_fecha_nacimiento DATE
)
BEGIN
  DECLARE v_existe INT DEFAULT 0;

  IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
    SELECT
      0 AS success,
      'nombre' AS campo,
      'El nombre es obligatorio' AS mensaje,
      NULL AS id_usuario;
  ELSEIF p_email IS NULL OR TRIM(p_email) = '' THEN
    SELECT
      0 AS success,
      'email' AS campo,
      'El correo electrónico es obligatorio' AS mensaje,
      NULL AS id_usuario;
  ELSEIF p_contrasena IS NULL OR TRIM(p_contrasena) = '' THEN
    SELECT
      0 AS success,
      'contrasena' AS campo,
      'La contraseña es obligatoria' AS mensaje,
      NULL AS id_usuario;
  ELSEIF LENGTH(TRIM(p_contrasena)) < 8 THEN
    SELECT
      0 AS success,
      'contrasena' AS campo,
      'La contraseña debe tener mínimo 8 caracteres' AS mensaje,
      NULL AS id_usuario;
  ELSEIF p_fecha_nacimiento IS NULL THEN
    SELECT
      0 AS success,
      'fecha_nacimiento' AS campo,
      'La fecha de nacimiento es obligatoria' AS mensaje,
      NULL AS id_usuario;
  ELSEIF p_fecha_nacimiento > CURDATE() THEN
    SELECT
      0 AS success,
      'fecha_nacimiento' AS campo,
      'La fecha de nacimiento no puede ser futura' AS mensaje,
      NULL AS id_usuario;
  ELSE
    SELECT COUNT(*) INTO v_existe
    FROM usuarios
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email));

    IF v_existe > 0 THEN
      SELECT
        0 AS success,
        'email' AS campo,
        'Este correo ya está registrado. Inicia sesión o usa otro.' AS mensaje,
        NULL AS id_usuario;
    ELSE
      INSERT INTO usuarios (
        nombre,
        email,
        contrasena,
        fecha_nacimiento,
        estado_suscripcion,
        fecha_registro
      )
      VALUES (
        TRIM(p_nombre),
        LOWER(TRIM(p_email)),
        p_contrasena,
        p_fecha_nacimiento,
        'free',
        NOW()
      );

      SELECT
        1 AS success,
        NULL AS campo,
        'Cuenta creada correctamente' AS mensaje,
        LAST_INSERT_ID() AS id_usuario;
    END IF;
  END IF;
END
`

try {
  await pool.query(
    'DROP PROCEDURE IF EXISTS spLoginUsuario'
  )
  await pool.query(
    'DROP PROCEDURE IF EXISTS spRegistrarUsuario'
  )

  await pool.query(crearLogin)
  await pool.query(crearRegistro)

  console.log('Procedimientos de auth actualizados (UTF-8)')

  await pool.query(
    `UPDATE usuarios
     SET email = LOWER(TRIM(email))
     WHERE email <> LOWER(TRIM(email))`
  )

  const [corregido] = await pool.query(
    `UPDATE usuarios
     SET email = 'gatohola27@gmail.com'
     WHERE LOWER(email) = 'gatohola@27gmail.com'`
  )

  if (corregido.affectedRows > 0) {
    console.log(
      'Correo corregido: gatohola@27gmail.com -> gatohola27@gmail.com'
    )
  }

  const [testOk] = await pool.query(
    'CALL spLoginUsuario(?, ?)',
    ['gatohola27@gmail.com', 'Admin123.']
  )
  console.log('Login OK:', testOk[0][0])

  const [testBadPass] = await pool.query(
    'CALL spLoginUsuario(?, ?)',
    ['gatohola27@gmail.com', 'wrongpass']
  )
  console.log('Login pass mala:', testBadPass[0][0])

  const [testBadEmail] = await pool.query(
    'CALL spLoginUsuario(?, ?)',
    ['noexiste@test.com', 'Admin123.']
  )
  console.log('Login correo malo:', testBadEmail[0][0])
} catch (error) {
  console.error('Error:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
