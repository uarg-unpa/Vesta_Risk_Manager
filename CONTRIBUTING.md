# Cómo contribuir

¡Gracias por querer colaborar con Vesta Risk Manager! Podés contribuir informando problemas, proponiendo mejoras, actualizando documentación o enviando cambios al código.

## Antes de comenzar

1. Revisá las [issues abiertas](https://github.com/uarg-unpa/Vesta_Risk_Manager/issues) para ver si ya existe una relacionada con tu idea.
2. Si no existe, creá una usando la plantilla que corresponda. Contá qué te gustaría hacer o describí el problema, con pasos para reproducirlo cuando sea posible.
3. Para cambios importantes, conversá el alcance en la issue con el equipo antes de empezar.

## Preparar una contribución

1. En GitHub, hacé un **fork** de este repositorio a tu cuenta.
2. Cloná tu fork y entrá al directorio creado:

   ```bash
   git clone https://github.com/TU-USUARIO/Vesta_Risk_Manager.git
   cd Vesta_Risk_Manager
   ```

   Reemplazá `TU-USUARIO` por tu nombre de usuario de GitHub.
3. Creá una rama para tu cambio a partir de `master`:

   ```bash
   git switch master
   git switch -c docs/guia-contribucion
   ```

   Elegí un nombre que describa tu trabajo; por ejemplo, `fix/corregir-login` o `docs/actualizar-instalacion`.
4. Realizá los cambios y revisalos con `git status` y `git diff`. Evitá incluir contraseñas, tokens o archivos de configuración personales.
5. Agregá los archivos, creá un commit y publicá la rama en tu fork:

   ```bash
   git add ruta/del/archivo
   git commit -m "docs: describir la mejora"
   git push -u origin docs/guia-contribucion
   ```

   Adaptá la ruta, el mensaje y el nombre de la rama a tu contribución. Para incluir varios archivos, agregalos indicando sus rutas.

## Comprobar los cambios

Revisá que la documentación y los enlaces modificados se lean correctamente. Para cambios en el código, describí las pruebas que realizaste y sus resultados.

El frontend está en `Implementación/Entregable VestaRiskManager/Frontend`. Su `package.json` incluye los comandos `npm run lint` y `npm run build`, que podés ejecutar desde ese directorio cuando correspondan a tu cambio. Indicá en la pull request si alguna comprobación no pudo ejecutarse.

## Abrir una pull request

Desde la rama publicada en tu fork, creá una **pull request** hacia `master` del repositorio `uarg-unpa/Vesta_Risk_Manager`. En la descripción:

- Contá qué cambiaste y por qué.
- Vinculá la issue relacionada, por ejemplo con `Refs #6`.
- Indicá cómo comprobaste el cambio y agregá capturas cuando ayuden a entenderlo.

El equipo revisará la propuesta y podrá hacer comentarios o pedir ajustes. Para responder con cambios, hacé nuevos commits en la misma rama y ejecutá `git push`; la pull request se actualizará automáticamente.

Gracias por colaborar y participar en la revisión de las propuestas.
