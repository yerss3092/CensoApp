### CensoApp MVP

## Objetivo del proyecto

Aplicación que tiene como objetivo recopilar una información relacionada a la población de una comunidad indigena. La forma en la que se recopilará esta informacoón es por medio de un formulario con diferente tipos de preguntas el cual será diligenciado por un encuestador quién facilita la ingesta de datos y asegura que los mismos sean consistentes.

Debe existir una forma en la que se puedan crear encuestadores a quienes luego con su perfil se les permite asociar cada encuesta que realizan

Los datos deben ser almacenados externamente con el ánimo de que puedan ser analizados y que se puedan generar gráficas y reportes.

## Especificaciones técnicas

 - La aplicación será desarrollada en React Native y debe tener una conexión a un servidor de base de datos de firebase
 - La aplicación debe tener soporte de geolocalización, esto significa que cada vez que se diligencie el formulario y se guarde el registro, se debe contar con la posición geográfica del lugar.
 - La aplicación debe almacenar de manera local los datos temporales del formulario que se está llenando. esto debido a que algunos dispositivos móviles fallan y no se queire tener que reiniciar el proceso de ceros.
 - Luego que la encuesta es diligenciada, y guardada, se debe reinicial los campos para proceder a una siguiente encuesta.
 - Cada vez que se llene el formulario, el mismo debe contar con los datos del encuestador, para luego relacionar la cantidad de encuestas que ha llevado a cabo cada uno 
 - La aplicación debe tener un login sencillo para que los encuestadores puedan ingresar a la aplicación y diligenciar las encuestas.

## Requisitos funcionales

 - La aplicación debe permitir crear un perfil de encuestador
 - La aplicación debe permitir que un encuestador pueda iniciar sesión
 - La aplicación debe permitir que un encuestador pueda diligenciar el formulario de encuesta
 - La aplicación debe permitir que un encuestador pueda guardar el formulario de encuesta
 - La aplicación debe permitir que un encuestador pueda ver la cantidad de encuestas que ha realizado

## Requisitos no funcionales

 - La aplicación debe ser desarrollada en React Native
 - La aplicación debe conectarse a una base de datos en Firebase
 - La aplicación debe almacenar localmente los datos temporales del formulario
 - La aplicación debe obtener la geolocalización del dispositivo al guardar el formulario
 - La aplicación debe ser responsiva y funcionar en dispositivos móviles y en computadoras
    - La aplicación debe tener una interfaz de usuario amigable y fácil de usar

## Entregables

 - Código fuente de la aplicación
 - Documentación técnica
 - Manual de usuario
 - Informe de pruebas
    - Despliegue de la aplicación en un servidor o plataforma en la nube
    - Pruebas unitarias y de integración
    - Pruebas de aceptación por parte del cliente

## Preguntas del formulario 

A continuación se encuentran las preguntas iniciales del formulario, algunas de ellas serán de selección múltiple, otras con selección unica, otras son preguntas abiertas otras pueden ser mixtas y existe la posibilidad de que hayan preguntas condicionales a otras preguntas. 

Las preguntas iniciales del formulario se encuentran en el archivo CensoResguardo-Preguntas.csv



