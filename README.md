# ElderCare — Frontend

Interfaz web del CRM **ElderCare** para la gestión de residentes de una residencia geriátrica. SPA construida con **Vue 3** y **Vite**, estilada con **Tailwind CSS** y conectada a la API REST del backend mediante **JWT**. Proyecto final de *Full Stack Developer with Java* (Factoría F5 + Capgemini).

> Este repositorio contiene **únicamente el frontend**. La API REST (Spring Boot + MySQL) vive en un repositorio aparte y debe estar en marcha para que la aplicación funcione.

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Funcionalidades](#funcionalidades)
3. [Stack tecnológico](#stack-tecnológico)
4. [Arquitectura](#arquitectura)
5. [Estructura del repositorio](#estructura-del-repositorio)
6. [Requisitos previos](#requisitos-previos)
7. [Configuración](#configuración)
8. [Puesta en marcha](#puesta-en-marcha)
9. [Conexión con el backend](#conexión-con-el-backend)
10. [Rutas de la aplicación](#rutas-de-la-aplicación)
11. [Estilos y diseño](#estilos-y-diseño)
12. [Scripts disponibles](#scripts-disponibles)
13. [Decisiones de diseño y limitaciones](#decisiones-de-diseño-y-limitaciones)
14. [Autor](#autor)

---

## Descripción

ElderCare Frontend es la cara visible del CRM. Permite iniciar sesión, consultar y gestionar el **listado de residentes**, ver la **ficha detallada** de cada uno, **asignarles habitación** respetando el aforo, y administrar las **habitaciones** del centro. Constituye la base de un proyecto mayor aún en fase de desarrollo.

Toda la comunicación con el servidor se hace contra la API REST del backend, enviando el **token JWT** en cada petición protegida.

Se realiza este proyecto por la motivación de haber iniciado, desde la dirección un centro geriátrico, el proceso de digitalización. En concreto, tiene dos objetivos:

1. Conocer el coste real de la implementación.
2. Lograr una versión mejor del servicio por el cual, en su momento, pagó una empresa del sector.

---

## Funcionalidades

- **Inicio de sesión** con usuario y contraseña, con opción *"recordarme"* y gestión del token JWT.
- **Listado de residentes** con **buscador** por nombre y **filtros** por grado de dependencia.
- **Ficha del residente**: datos personales, grado de dependencia, habitación, domicilio anterior y contacto familiar.
- **Alta y edición de residentes** mediante un formulario con validación.
- **Eliminación** de residentes.
- **Asignación y retirada de habitación** desde la ficha, con aviso visual cuando la habitación está **completa**.
- **Listado de habitaciones** con su tipo, ocupación y estado (disponible / completa).
- **Navegación protegida**: las rutas privadas redirigen al login si no hay sesión.

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build / dev server | Vite |
| Enrutado | Vue Router |
| Estilos | Tailwind CSS v4 (plugin `@tailwindcss/vite`) |
| Peticiones HTTP | Fetch API (sin librerías externas) |
| Autenticación | JWT (token en `localStorage` / `sessionStorage`) |

---

## Arquitectura

La aplicación separa responsabilidades en capas, de acuerdo a las buenas prácticas de Vue:

```
Views  →  Components  →  (markup/estilo)
  ↓
Services  →  utils/http  →  API REST (backend)
```

- **Views** (`views/`): pantallas completas asociadas a una ruta (login, listado, detalle, formulario…).
- **Components** (`components/`): piezas reutilizables, divididas en:
  - **Base** (agnósticos del dominio): `BaseInput`, `BaseSelect`, `BaseTextarea`.
  - **De dominio**: `ResidentCard`, `RoomCard`, `GradeBadge`, `InfoField`.
- **Layouts** (`layouts/`): `AdminLayout` aporta la cabecera y la navegación comunes; las vistas se pintan dentro de su `<RouterView>`.
- **Services** (`services/`): encapsulan las llamadas a la API (`authService`, `residentService`, `roomService`, `reportService`).
- **Utils** (`utils/`): utilidades transversales — `http` (cabeceras con token y manejo de respuesta), `authStorage` (gestión del token) y `grade` (etiquetas y colores del grado de dependencia, fuente única de verdad).

Cada capa tiene una única responsabilidad: los componentes no llaman a la API directamente (lo hacen las vistas vía *services*), y los *services* no conocen de UI.

---

## Estructura del repositorio

```
src/
├── assets/              # Imágenes (logo, etc.)
├── components/
│   ├── BaseInput.vue
│   ├── BaseSelect.vue
│   ├── BaseTextarea.vue
│   ├── GradeBadge.vue
│   ├── InfoField.vue
│   ├── ResidentCard.vue
│   └── RoomCard.vue
├── layouts/
│   └── AdminLayout.vue
├── router/
│   └── index.js
├── services/
│   ├── authService.js
│   ├── residentService.js
│   ├── roomService.js
│   └── reportService.js
├── utils/
│   ├── authStorage.js
│   ├── grade.js
│   └── http.js
├── views/
│   ├── auth/
│   │   └── LoginView.vue
│   ├── residents/
│   │   ├── ResidentsView.vue
│   │   ├── ResidentDetailView.vue
│   │   └── ResidentFormView.vue
│   └── rooms/
│       └── RoomsView.vue
├── App.vue
├── main.js
└── style.css            # Import de Tailwind + tokens de marca (@theme)
```

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm** (incluido con Node)
- El **backend de ElderCare** en marcha (por defecto en `http://localhost:8080`)

---

## Configuración

La URL de la API se define por variable de entorno. Crea tu `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

Contenido:

```properties
VITE_API_URL=http://localhost:8080/api/v1
```

Notas importantes:

- Las variables **deben** empezar por `VITE_` para que Vite las exponga al navegador.
- Vite lee el `.env` **solo al arrancar**: si lo cambias, reinicia el servidor de desarrollo.
- El `.env` real **no se versiona** (`.gitignore`); el `.env.example` sí, como documentación.
- Nunca pongas secretos aquí: todo lo que va en un `.env` de frontend acaba en el bundle público. `VITE_API_URL` es una URL pública, sin problema.

---

## Puesta en marcha

1. Clona el repositorio e instala dependencias:

```bash
   git clone <URL_DEL_REPOSITORIO>
   cd eldercare-frontend
   npm install
```

2. Crea tu `.env` (ver [Configuración](#configuración)).
3. Asegúrate de que el **backend está arrancado**.
4. Lanza el servidor de desarrollo:

```bash
   npm run dev
```

5. Abre la URL que indica la consola (por defecto `http://localhost:5173`).

Credenciales de prueba (sembradas por el backend):

- **Usuario:** `admin@eldercare.com`
- **Contraseña:** `admin1234`

---

## Conexión con el backend

- Todas las peticiones salen contra `VITE_API_URL` (por defecto `http://localhost:8080/api/v1`).
- Tras el login, el **token JWT** se guarda (en `localStorage` si marcas *recordarme*, en `sessionStorage` si no) y se envía en cada petición protegida como `Authorization: Bearer <token>`.
- El backend permite **CORS** para `http://localhost:5173`. Si Vite arranca en otro puerto (p. ej. 5174 porque el 5173 está ocupado), las peticiones se bloquearán por CORS: cierra los procesos de dev sobrantes para volver al 5173, o añade ese origen a la configuración CORS del backend.

---

## Rutas de la aplicación

| Ruta | Vista | Acceso |
|---|---|---|
| `/login` | Inicio de sesión | Público |
| `/residents` | Listado de residentes | Privado |
| `/residents/new` | Alta de residente | Privado |
| `/residents/:id` | Ficha del residente | Privado |
| `/residents/:id/edit` | Edición del residente | Privado |
| `/rooms` | Listado de habitaciones | Privado |

Las rutas privadas cuelgan de `AdminLayout` (cabecera + navegación comunes) y están protegidas por un *guard* que redirige a `/login` si no hay sesión.

---

## Estilos y diseño

- **Tailwind CSS v4**, integrado con el plugin oficial `@tailwindcss/vite` (sin `tailwind.config.js`).
- Los **colores y tokens de marca** se definen con `@theme` en `src/style.css` (navy corporativo, acentos, colores por grado de dependencia, etc.), lo que permite usarlos como utilidades (`bg-navy`, `text-accent`…).
- Diseño **responsive**, pensado *desktop-first*: navegación lateral en escritorio y barra inferior en móvil.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la build de producción |

---

## Decisiones de diseño y limitaciones

- **Un único rol (administrador)**, en línea con el alcance del backend.
- **Fotos por URL**: el campo de foto admite una URL de imagen (p. ej. un servicio de avatares). La subida por *drag & drop* queda como mejora futura.
- **Habitaciones**: se listan y se asignan; su alta/edición se gestiona desde el backend al ser infraestructura fija.
- **Informes**: la ficha del residente contempla el historial de informes; su gestión completa queda como siguiente iteración.

---

## Autor

**<Juan Isidro Menéndez>** — Proyecto final de *Full Stack Developer with Java* (Factoría F5 + Capgemini), Asturias.

Repositorio del backend: `<https://github.com/JuanIsidroMenendez/eldercare-backend>`