# Backend

Lógica del formulario de contacto, independiente de React y Next.js:

- `contact/submit.ts`: coordinación, validación y resultado del envío.
- `contact/guard.ts`: antispam, límite de intentos y deduplicación.
- `contact/delivery.ts`: entrega a webhook o Resend; credenciales solo en servidor.
- `contracts/`: campos, idiomas, validación pura y estados compartidos con la interfaz.
- `tests/`: pruebas de las reglas de negocio y de entrega.

Se ejecuta en el mismo proceso y despliegue de Next.js. El punto de entrada HTTP
es la Server Action de `frontend/app/actions.ts`; no hay un segundo servidor ni
un puerto adicional. Mantiene la arquitectura monolítica con separación de código.

Los contratos no importan APIs de Node, credenciales ni módulos de `contact/`,
por lo que la interfaz puede reutilizarlos sin incluir lógica privada en el navegador.
El backend no importa archivos del frontend. ESLint comprueba estas dependencias.

Configura el entorno del proceso en `frontend/.env.local` para desarrollo o en la
plataforma de despliegue para producción. El ejemplo está en `frontend/.env.example`.
La configuración incluye `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_SECRET`, o
`RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`.

Desde la raíz: `npm test -- backend/tests` ejecuta las pruebas de esta carpeta.
