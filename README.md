# Inventario — Web API .NET + React

Sistema de gestión de inventario (productos y categorías) compuesto por una **Web API REST en ASP.NET Core 10** con **Entity Framework Core** sobre **MySQL**, y una interfaz web en **React + TypeScript**.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | .NET 10, ASP.NET Core (controladores), EF Core 10, `MySql.EntityFrameworkCore` (proveedor oficial de Oracle) |
| Base de datos | MySQL 8 |
| Documentación API | OpenAPI + Scalar (`/scalar`) |
| Pruebas | xUnit + NSubstitute |
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router |

## Arquitectura

```
backend/
├── src/
│   ├── Inventory.Domain          → Entidades y reglas del dominio (sin dependencias)
│   ├── Inventory.Application     → Casos de uso: servicios, DTOs, validación, contratos de persistencia
│   ├── Inventory.Infrastructure  → EF Core: DbContext, configuraciones, repositorios, migraciones
│   └── Inventory.Api             → Controladores, manejo global de errores, CORS, OpenAPI
└── tests/
    └── Inventory.Application.Tests

frontend/src/
├── app/            → Router y cliente de React Query
├── components/     → UI reutilizable (Button, Modal, Pagination, Toast…) y layout
├── features/       → Módulos por funcionalidad (categories, products): api, hooks, componentes, páginas
├── lib/            → Cliente HTTP, manejo de errores, formateo
└── styles/         → Tokens de diseño y estilos (modo claro/oscuro)
```

Las dependencias apuntan hacia el dominio (Clean Architecture): `Api → Application ← Infrastructure`, y `Application → Domain`.

### Patrones de diseño aplicados

- **Repository** y **Unit of Work**: abstraen EF Core detrás de interfaces (`IProductRepository`, `IUnitOfWork`).
- **Service Layer**: la lógica de negocio vive en `ProductService` y `CategoryService`, no en los controladores.
- **DTO / Mapper**: las entidades nunca se exponen directamente; se usan `Request`/`Response`.
- **Inyección de dependencias**: cada capa registra sus servicios (`AddApplication`, `AddInfrastructure`, `AddPresentation`).
- **Manejo global de excepciones** (`IExceptionHandler`) con respuestas estándar **RFC 9457 Problem Details**.
- **Fluent configuration** de EF Core (`IEntityTypeConfiguration<T>`) y convención de nombres `snake_case` para MySQL.
- Frontend: **feature folders**, **custom hooks** sobre React Query (caché, invalidación) y **Provider** para notificaciones.

## Endpoints

| Método | Ruta | Operación |
|--------|------|-----------|
| GET | `/api/categories` | Lista categorías con número de productos (SELECT) |
| GET | `/api/categories/{id}` | Obtiene una categoría (SELECT) |
| POST | `/api/categories` | Crea una categoría (INSERT) |
| PUT | `/api/categories/{id}` | Actualiza una categoría (UPDATE) |
| DELETE | `/api/categories/{id}` | Elimina una categoría sin productos |
| GET | `/api/products?search=&categoryId=&isActive=&sortBy=Name\|Price\|Stock\|CreatedAt&descending=&page=&pageSize=` | Lista paginada con filtros y orden (SELECT) |
| GET | `/api/products/{id}` | Obtiene un producto (SELECT) |
| POST | `/api/products` | Crea un producto (INSERT) |
| PUT | `/api/products/{id}` | Actualiza un producto (UPDATE) |
| DELETE | `/api/products/{id}` | Elimina un producto |
| GET | `/health` | Estado de la API y conexión a la base de datos |

## Requisitos (Debian 12)

1. **.NET 10 SDK.** Sin permisos de administrador puedes instalarlo en tu carpeta de usuario:
   ```bash
   curl -sSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
   bash dotnet-install.sh --channel 10.0 --install-dir ~/.dotnet
   ```
   Agrega a tu `~/.zshrc` (o `~/.bashrc`):
   ```bash
   export DOTNET_ROOT="$HOME/.dotnet"
   export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"
   ```
2. **Node.js 20+** (por ejemplo con `nvm`).
3. **MySQL 8** en ejecución (`sudo systemctl status mysql`) con el usuario `root` y la contraseña `root`.

## Puesta en marcha

### 1. Backend

```bash
cd backend
dotnet tool restore          # instala dotnet-ef (herramienta local)
dotnet run --project src/Inventory.Api
```

- La API queda en `http://localhost:5080`.
- En modo *Development* aplica automáticamente las migraciones: crea la base `inventory_db`, las tablas `categories` y `products`, y carga datos de ejemplo.
- Documentación interactiva: `http://localhost:5080/scalar`.

La cadena de conexión está en `src/Inventory.Api/appsettings.json` (`ConnectionStrings:InventoryDb`). En producción conviene definirla con una variable de entorno:
```bash
export ConnectionStrings__InventoryDb="Server=...;Database=...;User=...;Password=..."
```

Aplicar las migraciones manualmente:
```bash
dotnet ef database update -p src/Inventory.Infrastructure -s src/Inventory.Api
```

Crear una nueva migración tras modificar el modelo:
```bash
dotnet ef migrations add <Nombre> -p src/Inventory.Infrastructure -s src/Inventory.Api -o Persistence/Migrations
```

Ejecutar las pruebas:
```bash
dotnet test
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite reenvía las peticiones `/api` a `http://localhost:5080` (ver `vite.config.ts`). Para usar otra URL copia `.env.example` a `.env` y ajusta `VITE_API_BASE_URL`.

Compilación para producción: `npm run build` (genera `frontend/dist`).

## Convenciones

- Código (variables, funciones, clases, tablas, columnas y constantes) en **inglés**.
- Todo el texto visible para el usuario (interfaz y mensajes de error de la API) en **español**.
