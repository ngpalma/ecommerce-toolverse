# Toolverse 🛠️

Ecommerce de herramientas desarrollado como proyecto final de bootcamp. Permite a los usuarios explorar un catálogo de herramientas, gestionar su carrito, realizar compras con Mercado Pago y dejar reseñas. Cuenta con un panel de administración completo para la gestión de productos, usuarios y órdenes.

---

## Tecnologías

### Backend (`apiToolVerse`)
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor REST API |
| PostgreSQL + Sequelize | Base de datos relacional y ORM |
| JWT + Cookies HTTP-only | Autenticación y autorización |
| bcryptjs | Hasheo de contraseñas |
| Mercado Pago SDK v2 | Procesamiento de pagos |
| Cloudinary | Almacenamiento de imágenes |
| Nodemailer | Envío de emails |
| Helmet + express-rate-limit | Seguridad HTTP |
| Nodemon | Hot reload en desarrollo |

### Frontend (`clientToolVerse`)
| Tecnología | Uso |
|---|---|
| React 18 (CRA) | UI |
| Redux + redux-thunk v3 | Estado global |
| redux-persist | Persistencia del estado (carrito, sesión) |
| React Router v6 | Navegación |
| Axios | Peticiones HTTP |
| CSS Modules | Estilos encapsulados |
| SweetAlert2 | Modales y alertas |
| jsPDF | Generación de comprobantes en PDF |
| react-responsive-carousel | Carousel de home |
| FontAwesome | Íconos |

---

## Estructura del proyecto

```
Ecommerce de Toolverse/
├── apiToolVerse/          # Backend — Node.js / Express
│   ├── src/
│   │   ├── controllers/   # Lógica de cada recurso
│   │   ├── middlewares/   # Auth, rate-limit, validaciones
│   │   ├── models/        # Modelos Sequelize
│   │   ├── routes/        # Definición de rutas
│   │   ├── seeders/       # Scripts de carga de datos
│   │   └── db.js          # Conexión y asociaciones
│   ├── .env.example
│   └── package.json
│
└── clientToolVerse/       # Frontend — React
    ├── src/
    │   ├── components/    # Componentes y vistas
    │   ├── redux/         # Actions, reducer, store
    │   └── index.css      # Variables CSS globales
    └── package.json
```

---

## Funcionalidades

### Usuarios (clientes)
- Registro con nombre, apellido, email, teléfono, dirección y ciudad
- Login con JWT almacenado en cookie HTTP-only
- Perfil editable (datos personales y direcciones de envío)
- Carrito de compras persistente
- Proceso de compra con selección de dirección de envío
- Pago integrado con **Mercado Pago**
- Historial de órdenes y descarga de comprobante en PDF
- Reseñas con puntaje en productos comprados

### Administradores
- Panel de administración protegido por rol
- CRUD completo de productos (con carga de imágenes vía Cloudinary)
- Gestión de usuarios y órdenes de compra
- Creación del primer admin vía script de consola

---

## Instalación y configuración

### Requisitos previos
- Node.js >= 18
- PostgreSQL >= 14
- Cuenta de [Mercado Pago Developers](https://developers.mercadopago.com/) (para obtener el Access Token)
- Cuenta de [Cloudinary](https://cloudinary.com/) (para subida de imágenes)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/ngpalma/ecommerce-toolverse.git
cd ecommerce-toolverse
```

---

### 2. Configurar el Backend

```bash
cd apiToolVerse
npm install
```

Copiar el archivo de ejemplo y completar las variables:

```bash
cp .env.example .env
```

Editar `.env` con los valores reales:

```env
# Base de datos PostgreSQL
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=toolverse

# Servidor
PORT=3001
NODE_ENV=development

# URL del frontend
CLIENT_URL=http://localhost:3000

# JWT — usá una clave larga y aleatoria
TOKEN_SECRET=una_clave_secreta_larga_y_aleatoria

# Mercado Pago
PROD_ACCESS_TOKEN=tu_access_token_de_produccion_o_sandbox

# Email (Gmail con contraseña de aplicación)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Administrador inicial
ADMIN_EMAIL=admin@toolverse.com
ADMIN_PASSWORD=Admin1234!
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Toolverse
ADMIN_PHONE=1100000000
```

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE toolverse;
```

Iniciar el servidor (las tablas se crean automáticamente con Sequelize al arrancar):

```bash
npm start
```

---

### 3. Configurar el Frontend

```bash
cd ../clientToolVerse
npm install
npm start
```

La app estará disponible en `http://localhost:3000`.

> El frontend hace proxy al backend en `localhost:3001`. Si cambiás el puerto del backend, actualizá el campo `"proxy"` en `clientToolVerse/package.json`.

---

## Scripts disponibles

### Backend (`apiToolVerse`)

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor con nodemon (hot reload) |
| `npm run seed` | Carga +100 productos de ejemplo en la base de datos |
| `npm run create-admin` | Crea el usuario administrador usando los datos del `.env` |
| `npm test` | Ejecuta los tests con Mocha |

### Frontend (`clientToolVerse`)

| Comando | Descripción |
|---|---|
| `npm start` | Inicia la app en modo desarrollo |
| `npm run build` | Genera el build de producción |
| `npm test` | Ejecuta los tests |

---

## Primeros pasos tras la instalación

1. Iniciar el backend: `npm start` (dentro de `apiToolVerse`)
2. Cargar productos de ejemplo: `npm run seed`
3. Crear el administrador: `npm run create-admin`
4. Iniciar el frontend: `npm start` (dentro de `clientToolVerse`)
5. Ingresar al panel de admin en `http://localhost:3000/login` con las credenciales definidas en `.env`

---

## Variables de entorno — referencia completa

| Variable | Descripción | Requerida |
|---|---|---|
| `DB_USER` | Usuario de PostgreSQL | ✅ |
| `DB_PASSWORD` | Contraseña de PostgreSQL | ✅ |
| `DB_HOST` | Host de la base de datos | ✅ |
| `DB_PORT` | Puerto de PostgreSQL (default: 5432) | ✅ |
| `DB_NAME` | Nombre de la base de datos | ✅ |
| `PORT` | Puerto del servidor Express (default: 3001) | ✅ |
| `NODE_ENV` | Entorno (`development` / `production`) | ✅ |
| `CLIENT_URL` | URL del frontend (para CORS y Mercado Pago) | ✅ |
| `TOKEN_SECRET` | Clave secreta para firmar JWT | ✅ |
| `PROD_ACCESS_TOKEN` | Access token de Mercado Pago | ✅ |
| `EMAIL_USER` | Email de Gmail para notificaciones | Opcional |
| `EMAIL_PASS` | Contraseña de aplicación de Gmail | Opcional |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | Opcional |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | Opcional |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | Opcional |
| `ADMIN_EMAIL` | Email del administrador inicial | ✅ (para `create-admin`) |
| `ADMIN_PASSWORD` | Contraseña del administrador inicial | ✅ (para `create-admin`) |
| `ADMIN_FIRST_NAME` | Nombre del administrador | ✅ (para `create-admin`) |
| `ADMIN_LAST_NAME` | Apellido del administrador | ✅ (para `create-admin`) |
| `ADMIN_PHONE` | Teléfono del administrador | ✅ (para `create-admin`) |

---

## API — endpoints principales

### Autenticación
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | No |

### Productos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/products` | Listar todos los productos | No |
| GET | `/products/:id` | Obtener producto por ID | No |
| GET | `/products?name=...` | Buscar productos por nombre | No |
| POST | `/products` | Crear producto | Admin |
| PUT | `/products/:id` | Actualizar producto | Admin |
| DELETE | `/products/:id` | Eliminar producto | Admin |

### Usuarios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/user` | Listar todos los usuarios | Admin |
| GET | `/user/:id` | Obtener usuario por ID | Usuario |
| PUT | `/user/:id` | Actualizar usuario | Usuario |

### Carrito y compras
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/purchaseCart` | Crear carrito de compra | Usuario |
| GET | `/purchaseCart/:id` | Obtener productos del carrito | Usuario |
| POST | `/payment` | Iniciar pago con Mercado Pago | Usuario |

---

## Notas importantes

### Mercado Pago en localhost
El parámetro `auto_return` de Mercado Pago requiere HTTPS. En desarrollo (localhost), el backend lo omite automáticamente y el comprobante se genera igual. En producción con HTTPS funciona sin cambios.

### Imágenes de productos
Las imágenes se pueden cargar de dos formas desde el panel admin:
- **Cloudinary**: mediante el widget de carga directa
- **URL externa**: pegando un link directo a la imagen

### Seguridad
- Las contraseñas se hashean con bcryptjs antes de guardarse
- Los JWT se envían en cookies `HttpOnly` (no accesibles desde JavaScript)
- Las rutas admin están protegidas tanto en frontend (`AdminRoute`) como en backend (middleware `adminRequired`)
- El servidor incluye Helmet (headers de seguridad) y rate limiting

---

## Autores

Proyecto final grupal — Bootcamp de Desarrollo Full Stack

**Nicolás Gerardo Palma y equipo de 7** 

---

## Licencia

ISC
