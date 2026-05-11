# MEMORIA DEL PROYECTO INTERMODULAR DEL CFGS DESARROLLO DE APLICACIONES WEB
En esta memoria se describe el desarrollo del proyecto final del ciclo formativo de Desarrollo de Aplicaciones Web (DAW). En este documento se recopilan todos los aspectos relacionados con el análisis, diseño, implementación y puesta en funcionamiento de la aplicación desarrollada.

El objetivo principal de esta memoria es explicar de forma detallada el proceso seguido durante la realización del proyecto, así como justificar las decisiones técnicas tomadas a lo largo del desarrollo.

A lo largo de los siguientes apartados se comentaran aspectos como las funcionalidades de la aplicación web, las tecnologías utilizadas, el diseño de la interfaz, la estructura de la base de datos, la implementación del backend y frontend, las pruebas realizadas y las posibles mejoras futuras del proyecto.

- Apartado 1 — Introducción y justificación
- Apartado 2 — Análisis y diseño del proyecto
- Apartado 3 — Conclusiones
- Apartado 4 — Bibliografía y fuentes de información
- Apartado 5 — Anexos

|        <!-- -->         |                           <!-- -->                            |
| :---------------------: | :-----------------------------------------------------------: |
| **Nombre del proyecto** |                           MerchNova                           |
|       **Nombre**        |                 Eduardo David Suárez Alvarado                 |
|    **Año académico**    |                        Año *2025/2026*                        |
|   **Ciclo y centro**    | *Desarrollo de Aplicaciones Web* — *IES Alonso de Avellaneda* |

---

## 1. Introducción y justificación
### Descripción de la aplicación a desarrollar
El proyecto que se va a desarrollar está relacionado con una plataforma de venta de productos personalizados con el propósito de vender 
El proyecto que se va a construir consiste en el desarrollo de una aplicación web de comercio electrónico orientada a la venta de productos personalizados. La plataforma permitirá a los usuarios explorar diferentes categorías de productos (`tazas, camisetas, peluches entre otros`), visualizar información detallada de cada artículo y realizar compras de forma sencilla y segura.

La finalidad principal de la aplicación es ofrecer una experiencia moderna y accesible para la compra de productos personalizados, permitiendo gestionar de manera eficiente tanto los productos como los usuarios y pedidos realizados dentro de la plataforma.

Entre las principales funcionalidades del sistema se incluyen el registro e inicio de sesión de usuarios (`Obligatorio para realizar compras en la aplicación`), la gestión del catálogo de productos, un carrito de compra (`Cada usuario tiene el suyo propio`), la realización de pedidos y un panel de administración para controlar distintos aspectos de la tienda (`Exclusivo para los usuarios administradores`).

Además, este proyecto tiene como objetivo aplicar y consolidar los conocimientos adquiridos durante el ciclo de Desarrollo de Aplicaciones Web (DAW), aparte de aplicar nuevas funcionalidades no vistas anteriormente en el curso, utilizando tecnologías actuales tanto para el desarrollo del frontend como del backend; así como buenas prácticas de diseño, organización y seguridad en aplicaciones web.

### Motivación de mi elección
Una de las prioridades por elegir este proyecto es la interactuación con el que he ido teniendo con este tipo de aplicaciones en los últimos años, además de pasar de utilizar una aplicación web que suelo visitar y utilizar a poder desarrollarla. Ya que es una de las aplicaciones más modernas y muy utilizada en el día a día en nuestra vida, llegando a tener millones de usuarios en todo el mundo.

Por otro lado, la idea de crear una tienda de productos personalizados resulta especialmente atractiva debido a la posibilidad de ofrecer artículos únicos y diferentes, permitiendo combinar creatividad y tecnología dentro de una misma aplicación.

Otro de los motivos que me ha llevado a la realización de este proyecto ha sido la oportunidad de aplicar de forma práctica los conocimientos adquiridos durante el ciclo de Desarrollo de Aplicaciones Web (DAW), trabajando desde las 2 partes que conforman el desarrollo (`Frontend y Backend`), la gestión de bases de datos (`No relacional`), la autenticación de usuarios y el diseño de interfaces modernas y funcionales.

Por último, este proyecto también supone un reto personal y profesional, ya que permite simular el desarrollo de una aplicación real, enfrentándose a problemas y situaciones similares a las que pueden encontrarse en el ámbito laboral del desarrollo web.

---
## 2. Análisis y diseño del proyecto

### 2.1 Descripción de la arquitectura web

La aplicación se basa en una arquitectura Single Page Application (SPA) que consiste en una única página HTML y que va cambiando de forma dinámica a través de JavaScript que permite otorgar una experiencia de usuario muy fluida e interactiva. Las partes que componen la aplicación son las siguientes:

1. Frontend: es la parte visual con la que interactúan los usuarios. Se encargara de mostrar la interfaz gráfica, gestionar la navegación entre vistas y enviar solicitudes al servidor (`NodeJS`) para obtener o modificar información.

La aplicación frontend ha sido desarrollada utilizando tecnologías modernas orientadas al desarrollo de interfaces dinámicas y responsivas. Entre sus funciones principales se encuentran:

- Visualización del catálogo de productos.
    - Paginación de los productos
    - Filtrado de productos según su categoría, valoración o precio.

- Gestión del carrito de compra.
    - Carrito con persistencia (`Evita perdida de productos y exclusivo para cada usuario`).
    - Modificación de la cantidad introducida.

- Registro e inicio de sesión de usuarios.
   - Incluye también inicio de sesión con Google y Discord.

- Visualización y gestión de pedidos.

- Panel de administración.
   - Exclusivo para administradores.

Al tratarse de una SPA, el cambio entre páginas o secciones se realiza de manera dinámica mediante un sistema de rutas del cliente, sin necesidad de recargar completamente la aplicación, mediante la biblioteca de `React Router DOM`, robusta y versátil que se utiliza para el enrutamiento de una aplicación React.

2. Backend: se encargara de procesar la lógica de negocio de la aplicación y gestionar la comunicación con la base de datos (`MongoDB`).

Entre sus responsabilidades principales destacan las siguentes:

- Gestión de usuarios y autenticación (`JsonWebToken`).
- Gestión de productos y categorías.
- Procesamiento de pedidos y gestión de datos.
- Control del stock.
- Validación de datos.
- Exposición de una API REST para la comunicación con el frontend.

El frontend y el backend se comunican mediante peticiones HTTP utilizando formatos de intercambio de datos como JSON.

3. Base de datos: la última y una de las más importantes, será la encargada de almacenar toda la información necesaria para el funcionamiento de la aplicación, como:

- Usuarios registrados y su información personal.
- Productos y categorías.
- Pedidos realizados.
- Direcciones del usuario
- Información del carrito.
- Valoraciones y datos adicionales.
- Métodos de pago e información personal del responsable.

El backend es el encargado de realizar las operaciones de lectura, inserción, modificación, eliminación de datos dentro de la base de datos y cualquier otro tipo de verificación.

Por último, la comunicación entre los diferentes componentes de la aplicación sigue el siguiente flujo:

 - El usuario interactúa con la interfaz frontend.
 - El frontend realiza una petición HTTP al backend mediante la API REST.
 - El backend procesa la solicitud y consulta la base de datos si es necesario.
 - La base de datos devuelve la información requerida al backend (si es requerido).
 - El backend responde al frontend y devuelve una respuesta en formato JSON (en algún caso redirige).
 - El frontend maneja y actualiza dinámicamente la interfaz con los datos recibidos.

Debido a esta arquitectura, la aplicación mantiene una estructura modular, organizada y escalable, facilitando tanto el mantenimiento como futuras ampliaciones del sistema.

---

### 2.2 Tecnologías y herramientas utilizadas
Para el desarrollo de la aplicación se han implementado diferentes tecnologías tanto para el frontend como para el backend, la base de datos y el despliegue del proyecto.

#### Frontend
En el frontend, la tecnología aplicada es React

- React
    React es un framework de JavaScript orientada al desarrollo de interfaces de usuario dinámicas e interactivas mediante estructuras llamadas componentes reutilizables. Su uso permite crear aplicaciones SPA (Single Page Application), mejorando la experiencia del usuario gracias a la carga dinámica de contenido sin recargar la página completa.

    Entre las ventajas de utilizar React destacan las siguentes:

    - Desarrollo basado en componentes reutilizables utilizando JSX.
    - Uso de un DOM virtual que ofrece rapidez y fluidez en la aplicación.
    - Renderizado de interfaces dinámicas y eficiente.
    - Gran compatibilidad con librerías externas.
    - Creación de aplicaciones móviles nativas con React Native.
    - Amplia comunidad y documentación.

  - Vite
    Vite es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y ágil para proyectos web modernos. Formado por un servidor de desarrollo que consta de funcionalidades mejoradas 

    Sus principales ventajas son:

    - Inicio rápido del servidor de desarrollo.
    - Compilación optimizada.
    - Mejor rendimiento en comparación con otras herramientas tradicionales.
    - Configuración sencilla.
    - Actualización rápida ante los cambios realizados.

--- 

#### Backend
Para el desarrollo del servidor y la lógica de negocio se ha utilizado Node.js siguiendo una arquitectura basada en API RESTful.

- Node.js
    Node.js es un entorno que permite ejecutar JavaScript en el lado del servidor, facilitando el desarrollo completo de la aplicación utilizando un único lenguaje tanto en frontend como en backend.

    Entre sus características principales destacan:

    - Alto rendimiento.
    - Arquitectura asíncrona y no bloqueante.
    - Escalabilidad, adecuado en arquitectura de microservicios.
    - Gran ecosistema de paquetes mediante npm (`Node Package Manager`).
    - API RESTful que devuelve respuestas en formato JSON.

    La comunicación entre frontend y backend se realiza mediante una API RESTful basada en peticiones HTTP.

    Se utilizan algunos métodos HTTP como:

    `GET` - Obtener información.
    `POST` - Crear recursos.
    `PUT/PATCH` - Actualizar información.
    `DELETE` - Eliminar recursos.

    > Los métodos que suelen utilizar generalmente son `POST` y `GET`

    Los datos intercambiados entre cliente y servidor se envían en formato JSON.

---

#### Base de datos
La base de datos utilizada en el proyecto es MongoDB.

- MongoDB
    MongoDB es una base de datos NoSQL de alto rendimiento orientada a documentos que almacena la información en formato BSON, similar a JSON, eliminando los esquemas fijos y tablas que utiliza una base de datos SQL. Su elección se debe a los siguientes motivos:

    - Flexibilidad en la estructura de datos.
    - Escalabilidad.
    - Buen rendimiento para aplicaciones web modernas.
    - Buena asociación con React + NodeJS.

    En ella se almacenan datos relacionados con:

    - Usuarios.
    - Información del usuario (`direcciones`, `datos de la cuenta`, etc).
    - Datos del pago.
    - Productos.
    - Pedidos.
    - Carrito de compra.
    - Categorías.
    - Chat de soporte técnico.

---

#### Integración y pruebas
Durante el desarrollo del proyecto se han realizado diferentes pruebas para garantizar el correcto funcionamiento de la aplicación y la válidez de los datos. Entre las pruebas realizadas destacan:

- Pruebas de navegación entre vistas.
- Validación de formularios.
- Comprobación de autenticación y autorización.
- Verificación de peticiones a la API.
- Pruebas de funcionamiento del carrito y pedidos.
- Comprobación de la correcta conexión con la base de datos.
- Depuración de código para garantizar la información que proviene de las distintas partes de la aplicación.

También se han utilizado las herramientas de desarrollo del navegador y pruebas manuales para detectar errores y mejorar la experiencia de usuario.

---

#### Seguridad
Para mejorar la seguridad de la aplicación se han aplicado diferentes medidas de protección tanto en frontend como en backend. Entre ellas destacan:

- Autenticación de usuarios mediante tokens.
- Encriptación de contraseñas.
- Validación de datos enviados por el usuario.
- Protección de rutas privadas sin acceso para usuarios sin login.
- Control de permisos según el tipo de usuario (`clientes` y `administradores`).
- Gestión segura de datos sensibles mediante el uso variables de entorno.
- Recuperación de datos en caso de caída del servidor.

Estas medidas ayudan a proteger la información de los usuarios y garantizar un acceso seguro a la aplicación.

---

#### Despliegue y hosting
Por determinar

---

#### Otras herramientas utilizadas
Además de las tecnologías principales, durante el desarrollo del proyecto se han utilizado otras herramientas complementarias:

- Git para el control de versiones (desde `VSC`).
- GitHub para el almacenamiento y gestión del repositorio.
- Postman para probar las rutas de la API.

---

### 2.3 Análisis de usuarios (Perfiles de usuario)
La aplicación está diseñada para ser utilizada por diferentes tipos de usuarios (`visitantes`, `usuarios registrados` y `usuarios administradores`), cada uno con funcionalidades y permisos específicos dentro del sistema. La división de perfiles permite organizar correctamente el acceso a la información y garantizar la seguridad y el correcto funcionamiento de la plataforma.

- Usuario visitante: El usuario visitante es cualquier persona que accede a la aplicación sin haber iniciado sesión. Tiene los siguientes permisos:
    - Necesidades principales.
    - Navegar por el catálogo de productos.
    - Visualizar información detallada de los productos y consultar precios, imágenes y valoraciones.
    - Buscar productos por categorías.
    - Registrarse para realizar compras.
    - Añadir productos deseados al carrito de compras.
    - No puede realizar pedidos ni acceder a funciones privadas.
    - No puede gestionar su perfil ni los pedidos de los usuarios.
    - No puede utilizar el soporte técnico.

    > El perfil de visitante es el que representa a cualquier usuario que viene a echar un vistazo a la tienda y visualizar sus productos.


- Usuario registrado: que corresponde a los clientes que disponen de una cuenta dentro de la plataforma.
    - Necesidades principales
    - Iniciar sesión de forma segura.
    - Gestionar y modificar su perfil personal y sus direcciones.
    - Gestión e incorporación de productos al carrito.
    - Realizar pedidos.
    - Consultar historial de compras.
    - Guardar información relacionada con sus pedidos y datos personales.
    - Acceso a funcionalidades privadas como el chat de ayuda.

    > Este perfil representa el principal tipo de usuario de la aplicación, ya que interactúa directamente con el sistema de compra de la tienda online.

- Usuario administrador: este usuario tiene los permisos del anterior sumados a los siguientes:
    - Gestionar el catálogo de productos.
    - Añadir, modificar o eliminar productos.
    - Controlar pedidos realizados por los clientes.
    - Gestiòn y control de usuarios registrados.
    - Supervisar el funcionamiento de la aplicación.
    - Acceso completo al panel de administración y funcionalidades restringidas.
    - Administración del contenido de la tienda.
    - Asistente de ayuda a los clientes.

    > El administrador es el usuario encargado de gestionar y supervisar el funcionamiento general de la plataforma. dispone de permisos especiales que permiten mantener actualizada la plataforma y garantizar su funcionamiento.


La aplicación implementa un sistema de control de acceso basado en roles de usuario. Dependiendo del tipo de cuenta autenticada, el sistema habilita o restringe determinadas funcionalidades. Por ello:

- Se mejora la seguridad de la aplicación.
- Se protege la información sensible.
- Se evita el acceso no autorizado a funciones administrativas.
- Se ofrece una experiencia adaptada a cada tipo de usuario.

> De esta forma, cada usuario interactúa únicamente con las herramientas y opciones necesarias según su función dentro de la plataforma.

---

### 2.4 Definición de requisitos funcionales y no funcionales

#### Requisitos funcionales
Los requisitos funcionales describen las funcionalidades y acciones que la aplicación debe ser capaz de realizar para garantizar el correcto funcionamiento de la tienda online.

Usuarios
- La gestión de usuarios, el sistema debe permitir el registro de nuevos usuarios. Una vez registrado, el usuario puede iniciar y cerrar de sesión. Dentro de la sesión, el usuario ya podrá modificar sus datos personales según el tipo de inicio de sesión que has escogido (en este caso, con `email` puedes modificar todos los campos y con otro tipo hay campos que no podrás modificar).
- La tienda online deberá diferenciar entre usuarios cliente y administrador, mostrando alguna etiqueta en el perfil o algo parecido.
- Restringir el acceso a determinadas rutas según el rol del usuario (dispone de `visitante`, `registrado` y `administrador`).

Gestión de productos, en la aplicación:
- Se mostrará un catálogo de productos personalizados.
- Podrá visualizar información detallada de cada producto.
- Se permitirá clasificar productos por categorías, valoración o precio.
- El administrador podrá añadir nuevos productos.
- El administrador podrá editar productos existentes.
- El administrador podrá eliminar productos del catálogo.

Carrito de compra, donde el usuario:
- Podrá añadir productos al carrito.
- Podrá modificar cantidades de productos.
- Podrá eliminar productos del carrito.
- Y el sistema calculará automáticamente el importe total del pedido.

Gestión de pedidos:
- El usuario podrá realizar pedidos.
- El sistema almacenará la información de los pedidos realizados (sin información sensible).
- El usuario podrá consultar su historial de compras.
- El administrador podrá visualizar y gestionar todos los pedidos de los clientes.
- La aplicación deberá permitir una navegación dinámica entre vistas sin recargar la página.
- El usuario podrá acceder rápidamente a las diferentes secciones de la tienda.
- El frontend deberá comunicarse con el backend mediante una API RESTful.
- El intercambio de información deberá realizarse en formato JSON.

#### Requisitos no funcionales
Los requisitos no funcionales definen las características técnicas y de calidad que debe cumplir la aplicación para garantizar una experiencia adecuada y un funcionamiento eficiente para el usuario que la va a utilizar.

Rendimiento
- La aplicación deberá ofrecer tiempos de carga reducidos.
- Las peticiones al servidor deberán responder de forma rápida y eficiente.
- La navegación entre páginas deberá ser fluida gracias al modelo SPA.

Usabilidad
- La interfaz deberá ser intuitiva y fácil de utilizar.
- El diseño debe de facilitar la navegación del usuario.
- Los elementos visuales deberán mantener una estructura clara y organizada.
- Diseño responsive para que la aplicación se adapte diferente tipo de pantallas.
- El sistema deberá ser compatible con dispositivos móviles, tablets y ordenadores.

Seguridad
- Las contraseñas deberán almacenarse de forma cifrada.
- El sistema deberá proteger las rutas privadas mediante autenticación o redirección inmediata.
- Solo los administradores podrán acceder a funciones de gestión.
- La aplicación deberá validar los datos recibidos para evitar accesos no autorizados o errores.


Escalabilidad
- La arquitectura de la aplicación deberá permitir añadir nuevas funcionalidades en el futuro.
- El sistema deberá mantener una estructura modular y organizada.

Mantenibilidad
- El código deberá de ser legible, estructurado y organizado correctamente.
- Se utilizarán componentes reutilizables para facilitar futuras modificaciones.
- La separación entre frontend, backend y base de datos facilitará el mantenimiento y control del proyecto.

Compatibilidad
- La aplicación deberá funcionar correctamente en los navegadores modernos más utilizados.
- El sistema deberá mantener compatibilidad con distintos sistemas operativos.
 
Dsponibilidad
- La aplicación deberá estar accesible siempre que el servidor se encuentre operativo.
- El sistema deberá minimizar errores críticos que afecten al uso de la plataforma como la pérdida de datos.
