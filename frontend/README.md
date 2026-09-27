# Frontend

Aplicación Next.js: rutas en `app/`, interfaz en `components/`, textos en `content/`
y activos en `public/`. Los estilos y el contenido bilingüe conservan su funcionamiento.

Ejecuta los comandos desde la raíz del repositorio:

```sh
npm run dev
npm run build
npm run start
```

`app/actions.ts` es el adaptador de transporte del formulario. Obtiene el contexto
de la petición y delega al backend; no contiene reglas de negocio ni integración de correo.
Los componentes del navegador solo pueden importar `@backend/contracts/*`.

Next.js carga la configuración local desde `frontend/.env.local`; usa `.env.example`
como referencia. Las variables de correo y CRM son exclusivas del servidor y nunca
deben llevar el prefijo `NEXT_PUBLIC_`.

La compilación incluye `../backend/`. Despliega el repositorio completo siguiendo
el README raíz; esta carpeta no es una aplicación autónoma.
