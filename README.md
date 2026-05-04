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
## Análisis y diseño del proyecto

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

El backend es el encargado de realizar las operaciones de lectura, inserción, modificación y eliminación de datos dentro de la base de datos.