# Portal Educativo - README

## Descripción del Proyecto

Este proyecto es un Portal Educativo diseñado para facilitar la gestión académica, permitiendo a profesores y administradores gestionar calificaciones y materiales de clase de manera eficiente. El sistema incluye dos módulos principales:

1. **CRUD de Calificaciones**: Permite crear, leer, actualizar y eliminar calificaciones de los estudiantes, con vistas intuitivas para su gestión.
2. **CRUD de Materiales de Clase**: Facilita la administración de recursos educativos, incluyendo documentos, presentaciones y otros materiales necesarios para las clases.

## Integrantes del Proyecto

1. **Alexis Rolando Alderete Araujo**  
   - Rol: Desarrollador Frontend  
   - Tareas: Diseño de interfaces, implementación de vistas  


## Tareas Realizadas

1. **Añadir vista de lista de calificaciones**  
   - Implementación de una tabla interactiva que muestra las calificaciones de los estudiantes.  
   - Funcionalidades: filtrado, ordenamiento y paginación.  

2. **Añadir vista de creación de una nueva calificación**  
   - Formulario intuitivo para ingresar nuevas calificaciones.  
   - Validación de campos y retroalimentación visual.  

3. **Añadir vista de lista de materiales de clases**  
   - Visualización de materiales organizados por curso o tema.  
   - Opciones para descargar o eliminar archivos.  

## Instalación del Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

### Requisitos Previos
- Node.js (v16 o superior)
- npm (v8 o superior) o yarn
- Base de datos MySQL o PostgreSQL

### Pasos para la Instalación

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/tu-usuario/portal-educativo.git
   cd portal-educativo
   ```

2. **Instalar dependencias**  
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**  
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:  
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=portal_educativo
   PORT=3000
   ```

4. **Ejecutar migraciones (si aplica)**  
   ```bash
   npm run migrate
   # o
   yarn migrate
   ```

5. **Iniciar el servidor**  
   ```bash
   npm start
   # o
   yarn start
   ```

6. **Acceder al proyecto**  
   Abre tu navegador y visita:  
   ```
   http://localhost:3000
   ```

### Notas Adicionales
- Para el modo desarrollo, usa `npm run dev` o `yarn dev` (requiere nodemon instalado globalmente).  
- Asegúrate de que la base de datos esté configurada y corriendo antes de iniciar el servidor.  

¡Gracias por usar nuestro Portal Educativo!
