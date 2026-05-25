# 💄 PINKYPIE - Proyecto 3 Bases de Datos

## Descripción general

**PINKYPIE** es una aplicación web para la gestión de una tienda de maquillaje.  
El sistema permite administrar productos, clientes, ventas, reportes e inventario desde una interfaz web conectada a una base de datos PostgreSQL.

Este repositorio corresponde al **Proyecto 3** del curso de Bases de Datos.  
La idea principal fue tomar la aplicación del Proyecto 2 y extenderla con seguridad a nivel de base de datos, roles reales en PostgreSQL, permisos por tipo de usuario, stored procedures y uso de ORM en el backend.

En palabras simples: el Proyecto 2 ya tenía la tienda funcionando; en este Proyecto 3 se reforzó la parte de base de datos y seguridad para que no todo dependa únicamente del frontend o del backend.

---

## Rama de entrega

El proyecto debe entregarse en la rama:

```bash
proyecto-3
```

Para verificar la rama actual:

```bash
git branch
```

---

## Tecnologías utilizadas

### Frontend

- React
- React Router DOM
- Axios
- Lucide React
- CSS personalizado

### Backend

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT para autenticación
- bcryptjs para validación de contraseñas
- dotenv para variables de entorno
- cors

### Base de datos

- PostgreSQL 17
- Roles y usuarios de PostgreSQL
- Stored procedures / funciones en PL/pgSQL
- Vistas
- Índices
- Scripts SQL organizados

### Infraestructura

- Docker
- Docker Compose

---

## Estructura general del proyecto

```txt
p1_pinkypie/
│
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientesController.js
│   │   ├── productosController.js
│   │   ├── ventasController.js
│   │   ├── reportesController.js
│   │   └── proceduresController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Categoria.js
│   │   ├── Cliente.js
│   │   ├── Marca.js
│   │   ├── Producto.js
│   │   ├── Proveedor.js
│   │   └── index.js
│   │
│   └── routes/
│       ├── auth.js
│       ├── clientes.js
│       ├── productos.js
│       ├── ventas.js
│       ├── reportes.js
│       └── procedures.js
│
├── database/
│   ├── 01-schema.sql
│   ├── 02_views.sql
│   ├── 03_roles.sql
│   ├── 04_usuarios_prueba.sql
│   ├── 05_seed.sql
│   ├── 06_seed_usuarios.sql
│   ├── 07_indexes.sql
│   ├── 08_stored_procedures.sql
│   └── queries.sql
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   │
│   └── src/
│       ├── App.js
│       ├── App.css
│       │
│       ├── components/
│       │   ├── AlertMessage.jsx
│       │   ├── ClientForm.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductForm.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Sidebar.jsx
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Productos.jsx
│       │   ├── Clientes.jsx
│       │   ├── Ventas.jsx
│       │   ├── Reportes.jsx
│       │   └── Procedures.jsx
│       │
│       └── services/
│           └── api.js
│
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## Variables de entorno

El proyecto usa variables de entorno para no dejar la configuración del backend directamente en el código.

El archivo `.env.example` debe contener una estructura parecida a esta:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=PINKYPIE
DB_USER=proy3
DB_PASSWORD=secret

PORT=4000
JWT_SECRET=pinkypie_secret_key
```

Para ejecutar el proyecto localmente, se debe crear un archivo `.env` tomando como base el `.env.example`.

---

## Credenciales obligatorias de base de datos

Para este proyecto se utilizan las credenciales indicadas para calificación:

```txt
Usuario: proy3
Contraseña: secret
Base de datos: PINKYPIE
```

Estas credenciales están configuradas en `docker-compose.yml` para el contenedor de PostgreSQL.

---

## Levantar el proyecto desde cero

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Este comando construye y levanta los tres servicios principales:

- Base de datos PostgreSQL
- Backend Node/Express
- Frontend React

---

## Reiniciar completamente la base de datos

Si se necesita volver a ejecutar todos los scripts SQL desde cero, se debe eliminar el volumen de PostgreSQL:

```bash
docker compose down -v
docker compose up --build
```

Esto borra la base anterior y vuelve a crear tablas, roles, usuarios, datos iniciales, vistas, índices y stored procedures.

---

## Detener el proyecto

```bash
docker compose down
```

---

## Ver contenedores activos

```bash
docker ps
```

---

## Ver logs

```bash
docker compose logs
```

Para ver logs de un servicio específico:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

---

## Acceso a la aplicación

Cuando los contenedores estén levantados, la aplicación se abre en:

```txt
http://localhost:3000
```

La API del backend corre en:

```txt
http://localhost:4000
```

---

## Usuario principal de la aplicación

Para ingresar desde la pantalla de login de React se utiliza:

```txt
Usuario: admin
Contraseña: admin123
```

Este usuario permite acceder a la interfaz principal de la aplicación para probar productos, clientes, ventas, reportes y la pantalla de operaciones de base de datos.

---

## Usuarios PostgreSQL para validación de roles

Además del usuario principal de la aplicación, el proyecto crea usuarios directamente en PostgreSQL para demostrar la seguridad a nivel de base de datos.

Estos usuarios no se usan para iniciar sesión en React.  
Sirven para conectarse directamente a PostgreSQL y probar que los permisos de cada rol funcionan correctamente.

| Usuario PostgreSQL | Contraseña | Rol asignado | Propósito |
|---|---|---|---|
| `admin_user` | `admin123` | `role_admin` | Administración total de la base |
| `gerente_user` | `gerente123` | `role_gerente` | Gestión de tienda y reportes |
| `vendedor_user` | `vendedor123` | `role_vendedor` | Operaciones de venta |
| `inventario_user` | `inventario123` | `role_inventario` | Control de productos e inventario |
| `consulta_user` | `consulta123` | `role_consulta` | Consulta y auditoría de información |

Estos usuarios se crean en:

```txt
database/04_usuarios_prueba.sql
```

---

## Cómo probar los usuarios PostgreSQL

Primero se debe levantar el proyecto:

```bash
docker compose up -d
```

Luego se puede entrar con cada usuario usando `PGPASSWORD`.

### Admin

```bash
docker exec -it pinkypie_db env PGPASSWORD=admin123 psql -U admin_user -d PINKYPIE
```

### Gerente

```bash
docker exec -it pinkypie_db env PGPASSWORD=gerente123 psql -U gerente_user -d PINKYPIE
```

### Vendedor

```bash
docker exec -it pinkypie_db env PGPASSWORD=vendedor123 psql -U vendedor_user -d PINKYPIE
```

### Inventario

```bash
docker exec -it pinkypie_db env PGPASSWORD=inventario123 psql -U inventario_user -d PINKYPIE
```

### Consulta

```bash
docker exec -it pinkypie_db env PGPASSWORD=consulta123 psql -U consulta_user -d PINKYPIE
```

Para salir de PostgreSQL:

```sql
\q
```

---

## Pruebas sugeridas de permisos

Una vez dentro de PostgreSQL con cualquier usuario, se puede verificar el usuario actual:

```sql
SELECT current_user;
```

También se puede probar lectura:

```sql
SELECT * FROM producto LIMIT 5;
```

Y probar actualización:

```sql
UPDATE producto
SET stock = stock
WHERE id_producto = 1;
```

La idea es que algunos usuarios puedan ejecutar ciertas operaciones y otros no.  
Por ejemplo, `consulta_user` debería poder hacer consultas, pero no debería poder actualizar productos. Si PostgreSQL devuelve `permission denied`, significa que el permiso está funcionando correctamente.

---

## Roles definidos en PostgreSQL

El proyecto define exactamente cinco roles en PostgreSQL por medio de `CREATE ROLE`.

Los roles están en:

```txt
database/03_roles.sql
```

También se usan instrucciones `GRANT` y `REVOKE` para asignar permisos de forma granular.

| Rol | Descripción |
|---|---|
| `role_admin` | Tiene acceso administrativo a las tablas principales del sistema |
| `role_gerente` | Puede consultar información general, administrar productos y revisar reportes |
| `role_vendedor` | Puede consultar productos, registrar clientes y participar en ventas |
| `role_inventario` | Puede administrar categorías, marcas y productos relacionados con inventario |
| `role_consulta` | Tiene permisos de solo lectura para auditoría o consulta |

---

## Permisos por rol

### `role_admin`

Este rol tiene los permisos más amplios del sistema.

Permisos principales:

- Todos los privilegios sobre tablas principales:
  - `categoria`
  - `marca`
  - `proveedor`
  - `producto`
  - `cliente`
  - `empleado`
  - `usuario`
  - `venta`
  - `detalle_venta`
- Uso y consulta de secuencias.
- Consulta de vistas:
  - `v_stock_bajo`
  - `v_ventas_diarias`

---

### `role_gerente`

Este rol representa a una persona encargada de la gestión general de la tienda.

Permisos principales:

- Puede consultar tablas principales del negocio.
- Puede insertar, actualizar y eliminar:
  - `categoria`
  - `marca`
  - `proveedor`
  - `producto`
- Puede insertar y actualizar:
  - `cliente`
  - `empleado`
- Puede actualizar ventas.
- Puede consultar vistas de reportes:
  - `v_stock_bajo`
  - `v_ventas_diarias`

---

### `role_vendedor`

Este rol representa a los usuarios que atienden ventas.

Permisos principales:

- Puede consultar:
  - `categoria`
  - `marca`
  - `producto`
  - `empleado`
- Puede consultar e insertar:
  - `cliente`
  - `venta`
  - `detalle_venta`
- Puede usar secuencias relacionadas con:
  - ventas
  - detalle de venta
  - clientes
- Puede consultar la vista:
  - `v_ventas_diarias`

Este rol no debe tener permisos para modificar productos directamente, ya que eso corresponde al área de inventario o administración.

---

### `role_inventario`

Este rol representa al encargado del control de inventario.

Permisos principales:

- Puede consultar, insertar y actualizar:
  - `categoria`
  - `marca`
  - `producto`
- Puede consultar:
  - `proveedor`
- Puede usar secuencias de:
  - categorías
  - marcas
  - productos
- Puede consultar la vista:
  - `v_stock_bajo`

Este rol se enfoca en el manejo de productos y stock, pero no en la administración de ventas.

---

### `role_consulta`

Este rol es de solo lectura.

Permisos principales:

- Puede consultar:
  - `categoria`
  - `marca`
  - `proveedor`
  - `producto`
  - `cliente`
  - `empleado`
  - `venta`
  - `detalle_venta`
- Puede consultar vistas:
  - `v_stock_bajo`
  - `v_ventas_diarias`

Este rol sirve para auditoría, revisión o consultas sin modificar información.

---

## ORM utilizado

El backend usa **Sequelize** como ORM.

Se configuró Sequelize para trabajar con PostgreSQL y se definieron modelos para las entidades principales del negocio.

Modelos principales:

```txt
Categoria
Cliente
Marca
Producto
Proveedor
```

El uso de ORM se aplica principalmente en operaciones CRUD de la aplicación, por ejemplo:

- Listar productos
- Buscar producto por ID
- Crear productos
- Actualizar productos
- Desactivar productos
- Listar clientes
- Crear clientes
- Actualizar clientes
- Eliminar clientes

La relación más importante es la de `Producto`, ya que un producto pertenece a:

- una categoría
- una marca
- un proveedor

Esto permite que al listar o editar productos también se pueda mostrar información como la marca y el proveedor, no solo sus IDs.

---

## Stored procedures

El proyecto incluye stored procedures / funciones en PostgreSQL para operaciones importantes del negocio.

Se encuentran en:

```txt
database/08_stored_procedures.sql
```

| Stored procedure | Propósito |
|---|---|
| `sp_registrar_venta` | Registra una venta completa, valida stock, guarda detalle y descuenta inventario |
| `sp_actualizar_stock` | Actualiza el stock de un producto con entrada o salida |
| `sp_anular_venta` | Anula una venta y devuelve productos al inventario |
| `sp_reporte_ventas_periodo` | Genera reporte de ventas agrupado por fecha |
| `sp_productos_bajo_stock` | Lista productos cuyo stock está igual o debajo del mínimo |

---

## Manejo de errores y rollback

El stored procedure más importante es `sp_registrar_venta`, porque centraliza una operación crítica del negocio.

Este procedimiento:

1. Valida que el cliente exista.
2. Valida que el empleado exista y esté activo.
3. Crea el encabezado de la venta.
4. Recorre los productos recibidos.
5. Valida stock suficiente.
6. Inserta el detalle de venta.
7. Descuenta el inventario.
8. Actualiza el total de la venta.
9. Si ocurre un error, se lanza una excepción y PostgreSQL revierte la operación.

Esto evita que se registre una venta incompleta o que se descuente stock sin guardar correctamente el detalle.

---

## Endpoints relacionados con stored procedures

El backend expone endpoints para ejecutar los stored procedures desde la aplicación.

Rutas principales:

| Método | Endpoint | Stored procedure |
|---|---|---|
| `POST` | `/api/procedures/registrar-venta` | `sp_registrar_venta` |
| `POST` | `/api/procedures/actualizar-stock` | `sp_actualizar_stock` |
| `POST` | `/api/procedures/anular-venta` | `sp_anular_venta` |
| `GET` | `/api/procedures/reporte-ventas-periodo` | `sp_reporte_ventas_periodo` |
| `GET` | `/api/procedures/productos-bajo-stock` | `sp_productos_bajo_stock` |

---

## Pantalla de Operaciones BD

En el frontend se agregó una pantalla llamada **Operaciones BD**.

Desde esta pantalla se pueden probar los stored procedures de forma visual, sin tener que escribir las peticiones manualmente en Postman.

La pantalla permite ejecutar:

- Actualización de stock.
- Registro de venta.
- Anulación de venta.
- Reporte de ventas por período.
- Consulta de productos con bajo stock.

Esto ayuda a demostrar que los stored procedures no solo existen en la base de datos, sino que también se invocan desde el backend y se pueden consumir desde el frontend.

---

## Autenticación y protección de rutas

El proyecto utiliza autenticación mediante JWT.

Flujo general:

1. El usuario inicia sesión en React.
2. El frontend manda las credenciales al backend.
3. El backend valida el usuario y la contraseña.
4. Si todo es correcto, se genera un token JWT.
5. El frontend guarda el token.
6. Las peticiones posteriores se envían con el token en el header `Authorization`.

El frontend usa `ProtectedRoute` para evitar que se acceda a pantallas internas sin iniciar sesión.

El backend usa middleware de autenticación y autorización para proteger rutas según el rol del usuario autenticado.

---

## Rutas principales del backend

| Módulo | Ruta base |
|---|---|
| Autenticación | `/api/auth` |
| Productos | `/api/productos` |
| Clientes | `/api/clientes` |
| Ventas | `/api/ventas` |
| Reportes | `/api/reportes` |
| Stored procedures | `/api/procedures` |

---

## Scripts SQL

| Archivo | Descripción |
|---|---|
| `01-schema.sql` | Crea las tablas principales del sistema |
| `02_views.sql` | Crea vistas para stock bajo y ventas diarias |
| `03_roles.sql` | Crea roles y asigna permisos con `GRANT` y `REVOKE` |
| `04_usuarios_prueba.sql` | Crea usuarios PostgreSQL y les asigna roles |
| `05_seed.sql` | Inserta datos iniciales de categorías, marcas, proveedores, productos, clientes, etc. |
| `06_seed_usuarios.sql` | Inserta usuarios de aplicación |
| `07_indexes.sql` | Crea índices para mejorar el rendimiento |
| `08_stored_procedures.sql` | Crea los stored procedures del negocio |
| `queries.sql` | Consultas de apoyo o prueba |

---

## Comandos útiles para PostgreSQL

Entrar como usuario principal de la base:

```bash
docker exec -it pinkypie_db psql -U proy3 -d PINKYPIE
```

Listar tablas:

```sql
\dt
```

Ver usuarios de PostgreSQL:

```sql
\du
```

Ver datos de productos:

```sql
SELECT * FROM producto LIMIT 10;
```

Ver roles creados:

```sql
SELECT rolname
FROM pg_roles
WHERE rolname LIKE 'role_%';
```

Ver usuarios de prueba:

```sql
SELECT rolname
FROM pg_roles
WHERE rolname LIKE '%_user';
```

---

## Autor

**Adriana Martínez**  
Carné: **24086**

---
