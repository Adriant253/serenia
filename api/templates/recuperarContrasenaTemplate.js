export default function recuperarContrasenaTemplate(
    token
) {

    return `
        <div
            style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 20px;
            "
        >

            <h1>

                Serenia

            </h1>

            <p>

                Hemos recibido una solicitud para
                restablecer tu contraseña.

            </p>

            <p>

                Utiliza el siguiente código:

            </p>

            <div
                style="
                    background:#f4f4f4;
                    padding:20px;
                    text-align:center;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:5px;
                "
            >

                ${token}

            </div>

            <p>

                Este código expirará en 15 minutos.

            </p>

            <p>

                Si no realizaste esta solicitud,
                puedes ignorar este correo.

            </p>

        </div>
    `

}