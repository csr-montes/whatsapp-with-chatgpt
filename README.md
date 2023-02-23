## Whatsapp-With-ChatGPT

Este código es un servidor de Express.js que utiliza la librería `whatsapp-web.js` para interactuar con WhatsApp y la API de OpenAI para responder a mensajes enviados a uno mismo.

### Requisitos Previos

Para utilizar este código es necesario tener instalado Node.js y tener una cuenta de WhatsApp en el celular.

Además, para utilizar la API de OpenAI es necesario contar con una clave de API válida.

### Instalación

Para instalar las dependencias necesarias, ejecute el siguiente comando en la terminal:

    npm install

 

### Configuración

Antes de iniciar el servidor, se deben establecer las siguientes variables de entorno:

-   `OPENAI_API_KEY`: clave de API de OpenAI
-   `PORT`: puerto en el que se ejecutará el servidor (opcional, por defecto es el puerto 3000)

### Uso

Para iniciar el servidor, ejecute el siguiente comando en la terminal:

    npm start

Una vez iniciado, el servidor estará escuchando en el puerto indicado y se puede acceder a la siguiente URL para obtener el código QR para iniciar sesión en WhatsApp:

    http://localhost:3000/qrcode

Cuando se inicia sesión en WhatsApp escaneando el código QR, el servidor comenzará a responder a los mensajes que se envíen a la cuenta de uno, es decir, a tu mismo numero.

El servidor responde a los siguientes comandos:

-   `/help`: muestra la ayuda
-   `/key [OPENAI_API_KEY]`: establece la clave de API de OpenAI
-   `/gpt [query]`: realiza una consulta a la API de OpenAI utilizando el modelo "text-davinci-003"

### Notas adicionales

Este código incluye una función `isCommandAndExtractParams` que se utiliza para procesar los comandos enviados por el usuario y extraer los parámetros necesarios. Esta función se puede utilizar como una plantilla para procesar comandos adicionales.