# PINKYPIE - Proyecto 3 Bases de Datos

## Descripcion general

PINKYPIE es una aplicacion web para gestionar una tienda de maquillaje. Permite administrar productos, clientes, ventas, reportes e inventario desde una interfaz web conectada a una base de datos PostgreSQL.

---

## Rama de entrega

```bash
proyecto-3
```

Para verificar la rama actual:

```bash
git branch
```

---

## Tecnologias utilizadas

**Frontend**
- React
- React Router DOM
- Axios
- Lucide React
- CSS personalizado

**Backend**
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT para autenticacion
- bcryptjs para hashing de contrasenas
- dotenv para variables de entorno
- cors

**Base de datos**
- PostgreSQL 17
- Roles y usuarios de PostgreSQL
- Stored procedures en PL/pgSQL
- Vistas
- Indices
- Scripts SQL organizados

**Infraestructura**
- Docker
- Docker Compose

---

## Estructura del proyecto

```
p1_pinkypie/
|
|-- backend/
|   |-- app.js
|   |-- Dockerfile
|   |-- package.json
|   |
|   |-- config/
|   |   |-- db.js
|   |   +-- database.js
|   |
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- clientesController.js
|   |   |-- productosController.js
|   |   |-- ventasController.js
|   |   |-- reportesController.js
|   |   +-- proceduresController.js
|   |
|   |-- middlewares/
|   |   +-- authMiddleware.js
|   |
|   |-- models/
|   |   |-- Categoria.js
|   |   |-- Cliente.js
|   |   |-- Marca.js
|   |   |-- Producto.js
|   |   |-- Proveedor.js
|   |   +-- index.js
|   |
|   +-- routes/
|       |-- auth.js
|       |-- clientes.js
|       |-- productos.js
|       |-- ventas.js
|       |-- reportes.js
|       +-- procedures.js
|
|-- database/
|   |-- 01-schema.sql
|   |-- 02_views.sql
|   |-- 03_roles.sql
|   |-- 04_usuarios_prueba.sql
|   |-- 05_seed.sql
|   |-- 06_seed_usuarios.sql
|   |-- 07_indexes.sql
|   |-- 08_stored_procedures.sql
|   +-- queries.sql
|
|-- frontend/
|   |-- Dockerfile
|   |-- package.json
|   |
|   +-- src/
|       |-- App.js
|       |-- App.css
|       |
|       |-- components/
|       |   |-- AlertMessage.jsx
|       |   |-- ClientForm.jsx
|       |   |-- ProductCard.jsx
|       |   |-- ProductForm.jsx
|       |   |-- ProtectedRoute.jsx
|       |   +-- Sidebar.jsx
|       |
|       |-- pages/
|       |   |-- Login.jsx
|       |   |-- Dashboard.jsx
|       |   |-- Productos.jsx
|       |   |-- Clientes.jsx
|       |   |-- Ventas.jsx
|       |   |-- Reportes.jsx
|       |   +-- Procedures.jsx
|       |
|       +-- services/
|           +-- api.js
|
|-- docker-compose.yml
|-- .env
|-- .env.example
|-- .gitignore
+-- README.md
```

---

## Variables de entorno

El archivo `.env` debe estar en la raiz del proyecto con la siguiente estructura:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=PINKYPIE
DB_USER=proy3
DB_PASSWORD=secret

BACKEND_PORT=4000
FRONTEND_PORT=3000
JWT_SECRET=pinkypie_secret_key
```

---

## Credenciales de base de datos (calificacion)

Estas son las credenciales del usuario principal de PostgreSQL, configuradas en `docker-compose.yml`:

```
Usuario PostgreSQL: proy3
Contrasena:        secret
Base de datos:     PINKYPIE
Host:              db (dentro de Docker) / localhost (externo)
Puerto:            5432
```

---

## Levantar el proyecto

Desde la carpeta `p1_pinkypie/`:

```bash
docker compose up --build
```

Esto levanta los tres servicios:
- Base de datos PostgreSQL
- Backend Node/Express
- Frontend React

Una vez levantado, la aplicacion corre en:

```
Frontend: http://localhost:3000
Backend:  http://localhost:4000
```

---

## Reiniciar la base de datos desde cero

```bash
docker compose down -v
docker compose up --build
```

Esto borra el volumen anterior y vuelve a ejecutar todos los scripts SQL: tablas, roles, usuarios, datos iniciales, vistas, indices y stored procedures.

---

## Detener el proyecto

```bash
docker compose down
```

---

## Ver logs

```bash
docker compose logs
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

---

## Credenciales de usuarios de la aplicacion (login en React)

Estos usuarios se crean en `database/05_seed.sql` y `database/06_seed_usuarios.sql`.
Las contrasenas estan guardadas con hash bcrypt en la tabla `usuario`.

### Usuarios principales para pruebas

| Username | Contrasena | Rol en app | Empleado asociado |
|---|---|---|---|
| `admin` | `admin123` | admin | Daniela Rodas |
| `gerente` | `gerente123` | gerente | Gerente Prueba |
| `vendedor` | `vendedor123` | vendedor | Vendedor Prueba |
| `inventario` | `inventario123` | inventario | Inventario Prueba |
| `consulta` | `consulta123` | consulta | Consulta Prueba |



---

## Credenciales de usuarios PostgreSQL 

Estos usuarios se crean directamente en PostgreSQL a traves de `database/04_usuarios_prueba.sql`.
No sirven para hacer login en React. Sirven para conectarse directamente a PostgreSQL y verificar que los permisos de cada rol funcionan.

| Usuario PostgreSQL | Contrasena | Rol asignado | Proposito |
|---|---|---|---|
| `admin_user` | `admin123` | `role_admin` | Acceso total a la base de datos |
| `gerente_user` | `gerente123` | `role_gerente` | Gestion de tienda y reportes |
| `vendedor_user` | `vendedor123` | `role_vendedor` | Operaciones de venta |
| `inventario_user` | `inventario123` | `role_inventario` | Control de productos e inventario |
| `consulta_user` | `consulta123` | `role_consulta` | Solo lectura para auditoria |

---

## Como probar usuarios PostgreSQL

Primero levantar el proyecto:

```bash
docker compose up -d
```

Luego conectarse con cada usuario:

```bash
# Admin
docker exec -it pinkypie_db env PGPASSWORD=admin123 psql -U admin_user -d PINKYPIE

# Gerente
docker exec -it pinkypie_db env PGPASSWORD=gerente123 psql -U gerente_user -d PINKYPIE

# Vendedor
docker exec -it pinkypie_db env PGPASSWORD=vendedor123 psql -U vendedor_user -d PINKYPIE

# Inventario
docker exec -it pinkypie_db env PGPASSWORD=inventario123 psql -U inventario_user -d PINKYPIE

# Consulta
docker exec -it pinkypie_db env PGPASSWORD=consulta123 psql -U consulta_user -d PINKYPIE
```

Para salir de psql:

```sql
\q
```

---

## Roles definidos en PostgreSQL

Los roles se crean en `database/03_roles.sql` usando `CREATE ROLE`, `GRANT` y `REVOKE`.

| Rol | Descripcion |
|---|---|
| `role_admin` | Acceso total a todas las tablas del sistema |
| `role_gerente` | Puede gestionar productos, proveedores y revisar reportes |
| `role_vendedor` | Puede consultar productos y registrar ventas y clientes |
| `role_inventario` | Puede administrar categorias, marcas y productos |
| `role_consulta` | Solo lectura en todas las tablas para auditoria |

### Permisos por rol

**role_admin**
- Todos los privilegios sobre: `categoria`, `marca`, `proveedor`, `producto`, `cliente`, `empleado`, `usuario`, `venta`, `detalle_venta`
- Uso y consulta de secuencias
- Consulta de vistas: `v_stock_bajo`, `v_ventas_diarias`

**role_gerente**
- SELECT en todas las tablas principales
- INSERT, UPDATE, DELETE en: `categoria`, `marca`, `proveedor`, `producto`
- INSERT, UPDATE en: `cliente`, `empleado`
- UPDATE en: `venta`
- Consulta de vistas: `v_stock_bajo`, `v_ventas_diarias`

**role_vendedor**
- SELECT en: `categoria`, `marca`, `producto`, `empleado`
- SELECT, INSERT en: `cliente`, `venta`, `detalle_venta`
- Uso de secuencias de venta, detalle_venta y cliente
- Consulta de vista: `v_ventas_diarias`

**role_inventario**
- SELECT, INSERT, UPDATE en: `categoria`, `marca`, `producto`
- SELECT en: `proveedor`
- Uso de secuencias de categoria, marca y producto
- Consulta de vista: `v_stock_bajo`

**role_consulta**
- SELECT en: `categoria`, `marca`, `proveedor`, `producto`, `cliente`, `empleado`, `venta`, `detalle_venta`
- Consulta de vistas: `v_stock_bajo`, `v_ventas_diarias`

---

## Pruebas sugeridas de permisos

Dentro de PostgreSQL con cualquier usuario:

```sql
-- Ver con que usuario se esta conectado
SELECT current_user;

-- Probar lectura
SELECT * FROM producto LIMIT 5;

-- Probar actualizacion (falla si el rol no tiene permiso)
UPDATE producto SET stock = stock WHERE id_producto = 1;
```

Si PostgreSQL devuelve `permission denied`, los permisos estan funcionando correctamente.

---

## Stored procedures

Los stored procedures se encuentran en `database/08_stored_procedures.sql`.

| Stored procedure | Proposito |
|---|---|
| `sp_registrar_venta` | Registra una venta completa, valida stock, guarda detalle y descuenta inventario |
| `sp_actualizar_stock` | Actualiza el stock de un producto con entrada o salida |
| `sp_anular_venta` | Anula una venta y devuelve productos al inventario |
| `sp_reporte_ventas_periodo` | Genera reporte de ventas agrupado por fecha |
| `sp_productos_bajo_stock` | Lista productos cuyo stock esta igual o debajo del minimo |

El procedimiento `sp_registrar_venta` maneja transacciones con rollback automatico si ocurre algun error.

---

## Endpoints de stored procedures

| Metodo | Endpoint | Stored procedure |
|---|---|---|
| POST | `/api/procedures/registrar-venta` | `sp_registrar_venta` |
| POST | `/api/procedures/actualizar-stock` | `sp_actualizar_stock` |
| POST | `/api/procedures/anular-venta` | `sp_anular_venta` |
| GET | `/api/procedures/reporte-ventas-periodo` | `sp_reporte_ventas_periodo` |
| GET | `/api/procedures/productos-bajo-stock` | `sp_productos_bajo_stock` |

---

## Rutas principales del backend

| Modulo | Ruta base |
|---|---|
| Autenticacion | `/api/auth` |
| Productos | `/api/productos` |
| Clientes | `/api/clientes` |
| Ventas | `/api/ventas` |
| Reportes | `/api/reportes` |
| Stored procedures | `/api/procedures` |

---

## ORM utilizado

El backend usa Sequelize como ORM con PostgreSQL. Los modelos definidos son:

- Categoria
- Cliente
- Marca
- Producto
- Proveedor

Se usan principalmente para operaciones CRUD: listar, crear, actualizar y desactivar registros. Un Producto pertenece a una Categoria, una Marca y un Proveedor, lo que permite obtener esos datos en una sola consulta.

---

## Autenticacion

El sistema usa JWT para autenticacion.

1. El usuario inicia sesion en React con username y contrasena.
2. El backend valida las credenciales contra la base de datos.
3. Si son correctas, genera un token JWT con expiracion de 2 horas.
4. El frontend guarda el token y lo envia en el header `Authorization` en cada peticion.
5. El middleware del backend verifica el token antes de permitir acceso a rutas protegidas.

---

## Scripts SQL

| Archivo | Descripcion |
|---|---|
| `01-schema.sql` | Crea las tablas principales del sistema |
| `02_views.sql` | Crea vistas para stock bajo y ventas diarias |
| `03_roles.sql` | Crea roles y asigna permisos con GRANT y REVOKE |
| `04_usuarios_prueba.sql` | Crea usuarios PostgreSQL y les asigna roles |
| `05_seed.sql` | Datos iniciales: categorias, marcas, proveedores, productos, clientes, empleados, usuarios, ventas |
| `06_seed_usuarios.sql` | Actualiza la columna rol_bd en la tabla usuario |
| `07_indexes.sql` | Crea indices para mejorar el rendimiento de consultas |
| `08_stored_procedures.sql` | Crea los stored procedures del negocio |
| `queries.sql` | Consultas de apoyo y prueba |

---



