# MarketingIA

## Descripción General

MarketingIA es una aplicación web diseñada para la generación de conceptos creativos de marketing utilizando inteligencia artificial. Permite a los usuarios gestionar compañías, productos y personas de usuario, y luego generar ideas de campañas publicitarias basadas en estos datos. La aplicación está construida con Next.js, React y Supabase para la autenticación y la base de datos.

## Estructura del Proyecto

El proyecto sigue una estructura de carpetas clara para organizar el código fuente:

```
MarketingIA/
├── src/
│   ├── app/                  # Rutas de la aplicación y páginas (Next.js)
│   │   ├── (auth)/           # Rutas relacionadas con la autenticación (login, registro, etc.)
│   │   ├── (dashboard)/      # Rutas principales de la aplicación (campañas, productos, etc.)
│   │   │   ├── campaigns/    # Página de generación de conceptos creativos
│   │   │   ├── companies/    # Gestión de compañías
│   │   │   ├── create-products/ # Creación de productos
│   │   │   ├── dashboard/    # Página principal del dashboard
│   │   │   ├── layout.tsx    # Layout principal del dashboard
│   │   │   └── settings/     # Configuración de la aplicación
│   │   ├── api/              # Endpoints de la API (por ejemplo, webhooks)
│   │   ├── auth/             # Callbacks de autenticación
│   │   ├── onboarding/       # Proceso de onboarding de usuarios
│   │   ├── page.tsx          # Página de inicio de la aplicación
│   │   └── types.d.ts        # Definiciones de tipos globales
│   ├── components/           # Componentes reutilizables de React
│   │   ├── campaigns/        # Componentes específicos para campañas (sidebar, canvas)
│   │   ├── dashboard/        # Componentes del dashboard (cards, sidebar)
│   │   ├── marketing/        # Componentes de marketing (CTA, hero, pricing)
│   │   ├── members/          # Componentes para la gestión de miembros
│   │   ├── personas/         # Componentes para la gestión de personas de usuario
│   │   ├── products/         # Componentes para la gestión de productos
│   │   ├── ui/               # Componentes de UI genéricos (shadcn/ui)
│   │   └── ...               # Otros componentes generales
│   ├── lib/                  # Utilidades, servicios y contextos
│   │   ├── ai-service.ts     # Lógica para la integración con servicios de IA
│   │   ├── auth-context.tsx  # Contexto de autenticación
│   │   ├── services/         # Servicios específicos (por ejemplo, descripciones de contenido)
│   │   ├── tenant-context.tsx # Contexto de multi-tenancy
│   │   └── utils.ts          # Funciones de utilidad generales
│   ├── models/               # Definiciones de modelos de datos
│   │   ├── campaign.ts       # Modelo de campaña
│   │   ├── tenant.ts         # Modelo de tenant
│   │   └── user.ts           # Modelo de usuario
│   └── styles/               # Archivos de estilos globales
├── public/                   # Archivos estáticos (imágenes, etc.)
├── database/                 # Scripts SQL para la base de datos
├── supabase/                 # Configuraciones y scripts de Supabase
├── .env.local.example        # Archivo de configuración de variables de entorno
├── next.config.js            # Configuración de Next.js
├── package.json              # Dependencias del proyecto y scripts
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.js        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración de TypeScript
└── ...                       # Otros archivos de configuración y documentación
```

## Características Principales

-   **Autenticación de Usuarios**: Integración con Supabase para el registro, inicio de sesión y gestión de sesiones.
-   **Gestión de Compañías**: Permite a los usuarios crear y gestionar diferentes compañías.
-   **Gestión de Productos**: Asociar productos a compañías específicas.
-   **Gestión de Personas de Usuario**: Definir y gestionar personas de usuario para cada compañía.
-   **Generación de Conceptos Creativos con IA**: Utiliza un servicio de IA (simulado en `ai-service.ts`) para generar ideas de campañas basadas en la compañía, producto y persona de usuario seleccionados, junto con un brief de campaña.
-   **Edición y Gestión de Conceptos**: Funcionalidades para editar, guardar y eliminar los conceptos creativos generados.
-   **Interfaz de Usuario Moderna**: Construida con React y componentes de `shadcn/ui` para una experiencia de usuario consistente y atractiva.
-   **Multi-tenancy**: Soporte para múltiples organizaciones/tenants.

## Configuración del Entorno de Desarrollo

Para configurar el proyecto localmente, sigue los siguientes pasos:

1.  **Clonar el Repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd MarketingIA
    ```

2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto basado en `.env.local.example` y configura tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_supabase
    ```

4.  **Configurar Supabase (Opcional, si no tienes una instancia)**:
    Si necesitas configurar una nueva instancia de Supabase, puedes usar los scripts SQL en la carpeta `database/` y `supabase/` para crear las tablas necesarias (`organizations`, `products`, `user_personas`, etc.).

5.  **Ejecutar la Aplicación**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## Uso

1.  **Registro/Inicio de Sesión**: Accede a la aplicación y regístrate o inicia sesión.
2.  **Selección de Compañía**: En el dashboard, selecciona o crea una compañía.
3.  **Gestión de Productos y Personas**: Añade productos y personas de usuario asociados a tu compañía.
4.  **Generación de Conceptos**: Navega a la sección de campañas (`/campaigns`), selecciona una compañía, producto y persona de usuario, introduce un brief de campaña (o marca la opción "Sin brief") y haz clic en "Generar Conceptos".
5.  **Edición y Guardado**: Edita los conceptos generados y guárdalos según sea necesario.

## Tecnologías Utilizadas

-   [Next.js](https://nextjs.org/)
-   [React](https://react.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [shadcn/ui](https://ui.shadcn.com/)
-   [Supabase](https://supabase.com/)
-   [Lucide React](https://lucide.dev/)

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## Licencia

[Especificar licencia, por ejemplo, MIT]
