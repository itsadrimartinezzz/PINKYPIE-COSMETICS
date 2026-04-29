# 💄 PINKYPIE - Sistema de Gestión de Tienda

##  Descripción del proyecto

**PINKYPIE** es una aplicación web desarrollada para gestionar el inventario y las ventas de una tienda de productos de maquillaje.  
El sistema permite administrar productos, clientes, ventas y reportes desde una interfaz web conectada a una base de datos relacional.

El proyecto está dividido en tres partes principales:

- **Frontend:** interfaz visual desarrollada en React.
- **Backend:** API desarrollada con Node.js y Express.
- **Base de datos:** PostgreSQL, inicializada mediante scripts SQL.
- **Docker:** permite ejecutar todo el proyecto mediante contenedores.

---

## 👤 Usuarios de prueba

### Administrador
- **Usuario:** admin
- **Contraseña:** admin123

### Vendedores
- **Usuarios:** melanie, ashley, maria, sara, antonella, flor, diana, paulina, majo, julieta, ana, lorena, fatima, emilia, michelle, gabriela, josefina, ariana, laura, ivanna, paula
- **Contraseña:** vendedor123

### Supervisores
- **Usuarios:** valentina, rocio, karla
- **Contraseña:** supervisor123

##  Tecnologías utilizadas

- React
- Node.js
- Express
- PostgreSQL
- Docker
- Docker Compose
- JavaScript
- SQL

---

##  Comandos para ejecutar el proyecto con Docker

### 1. Levantar el proyecto

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Este comando construye y levanta los contenedores del frontend, backend y base de datos.

---

### 2. Detener los contenedores

```bash
docker compose down
```

Este comando detiene los contenedores sin borrar la información guardada en volúmenes.

---

### 3. Reiniciar todo, incluyendo la base de datos

```bash
docker compose down -v
docker compose up --build
```

El parámetro `-v` elimina los volúmenes, por lo que la base de datos se vuelve a crear desde cero usando los scripts SQL.

---

### 4. Ver contenedores activos

```bash
docker ps
```

---

### 5. Ver logs del proyecto

```bash
docker compose logs
```

---

## 🌐 Acceso a la aplicación

Una vez levantado el proyecto, se puede acceder desde el navegador:

```txt
http://localhost:3000
```

---

## 📂 Estructura del proyecto

```txt
P1_PINKYPIE/
│
├── backend/
│   ├── bin/
│   │   └── www
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientesController.js
│   │   ├── productosController.js
│   │   ├── reportesController.js
│   │   └── ventasController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clientes.js
│   │   ├── productos.js
│   │   ├── reportes.js
│   │   └── ventas.js
│   │
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   ├── init.sql
│   ├── schema.sql
│   ├── seed.sql
│   ├── views.sql
│   ├── indexes.sql
│   ├── queries.sql
│   └── PINKYPIE DIAGRAMA.pgerd
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertMessage.jsx
│   │   │   ├── ClientForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Clientes.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Reportes.jsx
│   │   │   └── Ventas.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

##  Explicación de la estructura

### Backend

La carpeta `backend` contiene toda la lógica del servidor y la API.

- `app.js`: archivo principal donde se configura Express y se conectan las rutas.
- `bin/www`: archivo utilizado para levantar el servidor.
- `config/db.js`: configuración de conexión con PostgreSQL.
- `controllers/`: contiene la lógica de cada módulo del sistema.
  - `authController.js`: maneja el inicio de sesión y autenticación.
  - `clientesController.js`: maneja las operaciones relacionadas con clientes.
  - `productosController.js`: maneja las operaciones relacionadas con productos.
  - `ventasController.js`: maneja el registro y consulta de ventas.
  - `reportesController.js`: maneja consultas para reportes.
- `routes/`: define las rutas que consume el frontend.
- `middlewares/`: contiene validaciones intermedias, como protección de rutas.
- `Dockerfile`: define cómo se construye el contenedor del backend.

---

### Frontend

La carpeta `frontend` contiene la interfaz gráfica del sistema.

- `src/components/`: contiene componentes reutilizables.
  - `Navbar.jsx`: barra de navegación.
  - `Sidebar.jsx`: menú lateral.
  - `ProductCard.jsx`: tarjeta visual de cada producto.
  - `ProductForm.jsx`: formulario para crear o editar productos.
  - `ClientForm.jsx`: formulario de clientes.
  - `ProtectedRoute.jsx`: protege rutas que requieren autenticación.
  - `AlertMessage.jsx`: muestra mensajes o alertas al usuario.
- `src/pages/`: contiene las pantallas principales.
  - `Login.jsx`: pantalla de inicio de sesión.
  - `Dashboard.jsx`: pantalla principal.
  - `Productos.jsx`: gestión de productos.
  - `Clientes.jsx`: gestión de clientes.
  - `Ventas.jsx`: registro de ventas.
  - `Reportes.jsx`: visualización de reportes.
- `src/services/api.js`: centraliza las peticiones hacia el backend.
- `App.js`: define la estructura general y rutas del frontend.
- `Dockerfile`: define cómo se construye el contenedor del frontend.

---

### Database

La carpeta `database` contiene los scripts SQL utilizados para construir la base de datos.

- `init.sql`: script principal que se ejecuta al iniciar el contenedor de PostgreSQL.
- `schema.sql`: contiene la estructura de las tablas.
- `seed.sql`: contiene datos iniciales para probar el sistema.
- `views.sql`: contiene vistas para consultas o reportes.
- `indexes.sql`: contiene índices para mejorar el rendimiento.
- `queries.sql`: contiene consultas de prueba o consultas importantes del proyecto.
- `PINKYPIE DIAGRAMA.pgerd`: diagrama entidad-relación de la base de datos.

---

##  Base de datos

La base de datos utilizada es **PostgreSQL**.

El modelo está diseñado para representar una tienda de maquillaje, tomando en cuenta entidades como:

- Categorías
- Marcas
- Proveedores
- Productos
- Clientes
- Empleados
- Usuarios
- Ventas
- Detalle de ventas

El archivo `init.sql` permite inicializar la base de datos automáticamente cuando se levanta el contenedor de Docker.  
Esto facilita que otra persona pueda ejecutar el proyecto sin tener que crear manualmente las tablas.

---

##  Funcionalidades implementadas

- Inicio de sesión de administrador.
- Gestión de productos.
- Creación, edición y desactivación de productos.
- Gestión de clientes.
- Registro de ventas.
- Consulta de reportes.
- Control de stock.
- Conexión entre frontend, backend y base de datos.
- Ejecución completa mediante Docker.
- Scripts SQL organizados por estructura, datos, vistas, índices y consultas.

---

##  Docker Compose

El archivo `docker-compose.yml` permite levantar todo el sistema con un solo comando.

El proyecto utiliza contenedores para:

- **Frontend:** aplicación React.
- **Backend:** API con Node.js y Express.
- **Base de datos:** PostgreSQL.

Esto permite que el proyecto sea más fácil de probar, transportar y entregar.

---

## ⚠️ Recomendaciones importantes

Antes de entregar el proyecto:

- Verificar que el proyecto corra con `docker compose up --build`.
- Revisar que el archivo `.env.example` tenga las variables necesarias.
- Confirmar que la base de datos se cree correctamente.
- Probar inicio de sesión, productos, clientes, ventas y reportes.

---

##  Autor

Adriana Martínez 24086

---

