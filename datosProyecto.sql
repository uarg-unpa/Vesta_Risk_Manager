INSERT INTO categoria (nombre, descripcion) VALUES
('Compromiso del Cliente', 'Riesgos asociados al nivel de involucramiento y apoyo del cliente en el proyecto, lo que puede afectar su desarrollo y entrega.'),
('Definición del Cliente', 'Riesgos derivados de la claridad y estabilidad de los requerimientos del cliente, pudiendo generar cambios inesperados y costos adicionales.'),
('Cronograma', 'Riesgos relacionados con retrasos en la planificación y ejecución del proyecto, afectando entregas y costos.'),
('Experiencia y Capacidad', 'Riesgos que surgen por la falta de conocimientos, habilidades o experiencia del equipo, lo que puede comprometer la calidad y el éxito del proyecto.'),
('Duración y Tamaño', 'Riesgos asociados a la magnitud y tiempo de ejecución del proyecto, donde una mayor duración o tamaño incrementa la probabilidad de imprevistos.'),
('Legal y Contractual', 'Riesgos vinculados a aspectos legales, regulaciones y cumplimiento de contratos, lo que puede generar disputas o sanciones.'),
('Tecnología', 'Riesgos derivados del uso de tecnologías nuevas o inestables, que pueden generar fallos, incompatibilidades o problemas de implementación.'),
('Complejidad', 'Riesgos asociados al grado de dificultad del proyecto en términos técnicos, organizativos o de integración con otros sistemas.'),
('Aspectos Financieros', 'Riesgos relacionados con la disponibilidad y gestión de recursos financieros, afectando la viabilidad y sostenibilidad del proyecto.'),
('Subcontratistas', 'Riesgos derivados de la dependencia de terceros para la ejecución de partes del proyecto, lo que puede afectar la calidad, tiempos y costos.');

insert into perfil (nombre) VALUES 
("Administrador"), 
("Usuario Estandar"), 
("Espectador");

INSERT into usuario (nombre, email) VALUES 
("Hugo", "hugofrey202@gmail.com"), ("Hugo Frey", "hugoantoniofrey2003@gmail.com"),  
("Agustin", "ardkrav@gmail.com"), ("Agustin Collareda","collaredaagustinpmg@gmail.com"), 
("Cintia", "cintiasod2021@gmail.com"), ("Cintia Hernandez","cintiah378@gmail.com"),
("Esteban Gesto", "egesto@uarg.unpa.edu.ar"), ("Karim Hallar", "khallar@uarg.unpa.edu.ar"), ("Osiris Sofia", "osofia@uarg.unpa.edu.ar"),
("Diego Portillo", "dportillo@gmail.com"), ("Franco Rosas", "frosas@gmail.com"), ("Glenda Flores", "gflores@gmail.com"),
("Eduardo Sly", "esly@gmail.com"), ("Valeria Ojeda", "vojeda@gmail.com"), ("Malena Oyarzo", "moyarzo@gmail.com"), ("Emilio", "emilio@gmail.com");

INSERT INTO usuario_perfil(id_usuario, id_perfil) VALUES 
(1,1), (2,2), 
(3,1), (4,2), 
(5,1), (6,2),
(7,1), (8,1), (9,1),
(10,2), (11,2), (12,2),
(13,2), (14,2), (15,2), (16,2);

Insert Into proyecto (nombre, descripcion, estado, fecha_inicio) values
("Vesta Risk Manager", "Es una aplicación que optimiza la identificación, analisis y monitereo de los diferentes 
riesgos que se presentan a la hora de desarrollar un software con el fin de asistir al usuario en la toma de 
decisiones y mitigar los riesgos", "activo", "2024-08-24"), 
("Testify", "Es una aplicación que optimiza el proceso de pruebas que se presentan a la hora de desarrollar 
un software con el fin de asistir al usuario en la toma de 
decisiones.", "activo", "2024-08-24"),
("Planificacion", "Es una aplicación que optimiza la estimaciones que se presentan a la hora de desarrollar un software 
con el fin de asistir al usuario en la toma de decisiones", "inactivo", "2024-08-24");

insert into proyecto_participante (id_proyecto, id_usuario, rol) values
(1, 2, "Desarrollador"), 
(1, 6, "Desarrollador"),
(1, 4, "Lider del Proyecto"),
(2, 13, "Desarrollador"), 
(2, 15, "Desarrollador"),
(2, 14, "Lider del Proyecto"),
(2, 16, "Desarrollador"),
(3, 10, "Desarrollador"), 
(3, 11, "Desarrollador"),
(3, 12, "Lider del Proyecto");

insert into proyecto_categoria (id_proyecto, id_categoria) values
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8),
(1,9),
(1,10),
(2,1),
(2,2),
(2,3),
(2,4),
(2,5),
(2,6),
(2,7),
(2,8),
(2,9),
(2,10),
(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(3,6),
(3,7),
(3,8),
(3,9),
(3,10);

insert into iteracion (nombre, fecha_inicio, fecha_fin, id_proyecto) values 
("Etapa Inicio - Iteración 1", "2024-08-27", "2024-09-10", 1),
("Etapa Elaboración - Iteración 1", "2024-09-11", "2024-09-24", 1),
("Etapa Elaboración - Iteración 2", "2024-09-25", "2024-10-11", 1),
("Etapa Construcción - Iteración 1", "2024-10-12", "2024-10-29", 1),
("Etapa Construcción - Iteración 2", "2024-10-30", "2024-11-08", 1),
("Etapa Construcción - Iteración 3", "2024-11-09", "2024-11-19", 1),
("Etapa Construcción - Iteración 4", "2025-01-18", "2025-01-27", 1),
("Etapa Construcción - Iteración 5", "2025-01-28", "2025-02-11", 1),
("Etapa Construcción - Iteración 6", "2025-03-06", "2025-03-23", 1),
("Etapa Construcción - Iteración 7", "2025-03-24", "2025-04-06", 1),
("Etapa Construcción - Iteración 8", "2025-04-24", "2025-05-09", 1),
("Etapa Construcción - Iteración 9", "2025-05-10", "2025-05-28", 1),
("Etapa Cierre - Iteración 1", "2025-05-29", "2025-06-12", 1),
("Etapa Inicio - Iteración 1", "2024-08-27", "2024-09-10", 2),
("Etapa Elaboración - Iteración 1", "2024-09-11", "2024-09-24", 2),
("Etapa Elaboración - Iteración 2", "2024-09-25", "2024-10-11", 2),
("Etapa Construcción - Iteración 1", "2024-10-12", "2024-10-29", 2),
("Etapa Construcción - Iteración 2", "2024-10-30", "2024-11-08", 2),
("Etapa Construcción - Iteración 3", "2024-11-09", "2024-11-19", 2),
("Etapa Construcción - Iteración 4", "2025-01-18", "2025-01-27", 2),
("Etapa Construcción - Iteración 5", "2025-01-28", "2025-02-11", 2),
("Etapa Construcción - Iteración 6", "2025-03-06", "2025-03-23", 2),
("Etapa Construcción - Iteración 7", "2025-03-24", "2025-04-06", 2),
("Etapa Construcción - Iteración 8", "2025-04-24", "2025-05-09", 2),
("Etapa Construcción - Iteración 9", "2025-05-10", "2025-05-28", 2),
("Etapa Cierre - Iteración 1", "2025-05-29", "2025-06-12", 2), 
("Etapa Inicio - Iteración 1", "2024-08-27", "2024-09-10", 3),
("Etapa Elaboración - Iteración 1", "2024-09-11", "2024-09-24", 3),
("Etapa Elaboración - Iteración 2", "2024-09-25", "2024-10-11", 3),
("Etapa Construcción - Iteración 1", "2024-10-12", "2024-10-29", 3),
("Etapa Construcción - Iteración 2", "2024-10-30", "2024-11-08", 3),
("Etapa Construcción - Iteración 3", "2024-11-09", "2024-11-19", 3),
("Etapa Construcción - Iteración 4", "2025-01-18", "2025-01-27", 3),
("Etapa Construcción - Iteración 5", "2025-01-28", "2025-02-11", 3),
("Etapa Construcción - Iteración 6", "2025-03-06", "2025-03-23", 3),
("Etapa Construcción - Iteración 7", "2025-03-24", "2025-04-06", 3),
("Etapa Construcción - Iteración 8", "2025-04-24", "2025-05-09", 3),
("Etapa Construcción - Iteración 9", "2025-05-10", "2025-05-28", 3),
("Etapa Cierre - Iteración 1", "2025-05-29", "2025-06-12", 3),
("Etapa Cierre - Iteración 2", "2025-06-27", "2025-07-7", 1);

-- Riesgos de Cronograma (Categoría 3)
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada una enfermedad, podría ocurrir la ausencia de un integrante del grupo en ocasiones importantes, lo que podría causar un impacto negativo en la moral del equipo, generando incertidumbre o sobrecarga de trabajo en los otros miembros.', 3, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la inexperiencia del equipo, podrían ocurrir dificultades en la estimación de tareas, lo que podría generar sobreasignación de tareas a ciertos miembros del equipo, provocando agotamiento o sobrecarga de trabajo.', 3, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la dependencia exclusiva de un solo desarrollador para la implementación del sistema, podrían ocurrir retrasos significativos cuando esta persona no esté disponible o esté sobrecargada, lo que podría resultar en incumplimientos de plazos y afectar la entrega del proyecto.', 3, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la falta de comunicación por un tiempo prolongado, podría ocurrir que el equipo no inicie en la fecha planificada, lo que conduciría a un mayor esfuerzo destinado al proyecto para cumplir con el tiempo propuesto.', 3, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dado el poco tiempo que puede destinar cada miembro del equipo a causa de los finales y/o cursada, podría ocurrir el descuido de las actividades de la gestión de proyectos, lo que conduciría a una mala organización y planificación de las tareas del proyecto.', 3, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dado que se realizará una próxima reunión con el cliente para revisar el avance del proyecto, existe la posibilidad de que surjan numerosas correcciones o ajustes solicitados. Esto podría generar retrasos en el cronograma, aumento en la carga de trabajo del equipo y posibles desviaciones respecto al alcance inicialmente planificado.', 3, 1);

-- Riesgos de Experiencia y Capacidad (Categoría 4)
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dado el escaso conocimiento de lenguaje de programación (php), podría ocurrir un desarrollo ineficiente y con errores, lo que podría generar dependencias excesivas de ciertos miembros del equipo, afectando la distribución equitativa de las tareas.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dados los errores humanos en el uso del sistema de control de versiones, podría ocurrir una pérdida de datos, lo que podría conducir a la repetición del trabajo y posible pérdida de funcionalidades ya desarrolladas.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la dificultad para encontrar soluciones a problemas técnicos complejos, podrían ocurrir estancamientos en el desarrollo del proyecto, lo que podría afectar la estabilidad general del producto, aumentando los riesgos de fallos críticos en el sistema.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dadas las diferencias en los estilos de codificación entre miembros del equipo, podría ocurrir una falta de consistencia en el código del proyecto, lo que podría dificultar la capacidad del equipo para mantener una estructura clara y comprensible del código a largo plazo.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dados los problemas de compatibilidad entre las herramientas y entornos de desarrollo de los miembros del equipo, podrían ocurrir inconsistencias en la ejecución y compilación del código, lo que podría derivar en conflictos entre los desarrolladores al intentar resolver los problemas de configuración, afectando la colaboración.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la falta de experiencia del grupo de desarrollo en la conducción de un proyecto de software, podría ocurrir una gestión ineficaz del proyecto, lo que podría conducir a posibles fallos en la calidad del producto final, a decisiones técnicas incorrectas y a una mala asignación de recursos.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dadas las dificultades en la implementación de pruebas efectivas y la falta de un proceso robusto, podrían no detectarse defectos hasta etapas tardías del desarrollo, lo que requeriría un esfuerzo mucho mayor para corregirlos e incrementaría la posibilidad de entregar versiones con defectos no detectados, impactando negativamente la reputación del equipo y aumentando el tiempo dedicado a correcciones en lugar de avanzar con la implementación restante.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dados los problemas con la gestión de permisos y roles en el sistema, podría ocurrir un control inadecuado de acceso, lo que podría aumentar la probabilidad de que el sistema sea vulnerable a ataques externos o internos.', 4, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dadas la detencion del desarrollo del proyecto y la posible documentación incompleta, podría ocurrir que el equipo olvide el dominio del problema, lo que conduciría a implementaciones que no cumplan con las expectativas del cliente.', 4, 1);

-- Riesgos de Tecnología (Categoría 7)
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dada la complejidad de la adaptación del módulo UARGFLOW a nuestra aplicación, podría ocurrir que el proceso de integración sea complicado, lo que podría causar errores en la interacción con otros módulos del sistema, afectando la integridad de los datos.', 7, 1);
INSERT INTO riesgo (descripcion, id_categoria, id_proyecto) VALUES ('Dadas las dificultades en la implementación de un sistema de notificaciones en tiempo real, podría ocurrir que las alertas no se envíen de manera oportuna, lo que podría provocar la pérdida de oportunidades para prevenir o mitigar incidentes críticos, afectando la seguridad o integridad del sistema.', 7, 1);


-- Iteracion C9
-- Evaluaciones para Riesgos de Cronograma (Categoría 3)
INSERT INTO `evaluacion`(`descripcion`, `impacto`, `probabilidad`, `fecha_realizacion`, `id_usuario`, `id_riesgo`, `id_proyecto`, `id_iteracion`) VALUES
('Siguen existiendo posibilidades de enfermedad, pero hemos distribuido mejor las tareas', 5, 2, '2025-06-01', 2, 1, 1, 12),
('Las estimaciones siguen siendo un problema, algunos miembros están sobrecargados', 8, 3, '2025-06-01', 4, 2, 1, 12),
('La dependencia de un desarrollador clave sigue siendo alta, pero estamos documentando su trabajo', 8, 3, '2025-06-01', 6, 3, 1, 12),
('La comunicación ha mejorado, pero aún es un punto de atención', 9, 1, '2025-06-01', 2, 4, 1, 12),
('Los exámenes finales están afectando seriamente la disponibilidad del equipo', 9, 5, '2025-06-01', 4, 5, 1, 12);

-- Evaluaciones para Riesgos de Experiencia y Capacidad (Categoría 4)
INSERT INTO `evaluacion`(`descripcion`, `impacto`, `probabilidad`, `fecha_realizacion`, `id_usuario`, `id_riesgo`, `id_proyecto`, `id_iteracion`) VALUES
('El conocimiento de PHP ha mejorado, pero aún se cometen errores básicos', 5, 2, '2025-06-01', 6, 7, 1, 12),
('Implementamos revisiones de Git obligatorias para prevenir pérdidas', 9, 1, '2025-06-01', 2, 8, 1, 12),
('Los problemas técnicos complejos nos han causado varios bloqueos esta iteración', 7, 4, '2025-06-01', 4, 9, 1, 12),
('Usamos prettier para unificar estilos de código, reduciendo el problema', 2, 1, '2025-06-01', 6, 10, 1, 12),
('Seguimos teniendo problemas de compatibilidad entre Windows y Linux', 3, 2, '2025-06-01', 2, 11, 1, 12),
('La experiencia en gestión ha mejorado con el uso de plantillas', 7, 3, '2025-06-01', 4, 12, 1, 12),
('Aumentamos la cobertura de pruebas para reducir bugs en producción', 6, 4, '2025-06-01', 6, 13, 1, 12),
('Documentamos después de cada hito para prevenir pérdida de conocimiento', 9, 2, '2025-06-01', 4, 15, 1, 12);

-- Ultima iteracion
-- Evaluaciones para Riesgos de Cronograma
INSERT INTO `evaluacion`(`descripcion`, `impacto`, `probabilidad`, `fecha_realizacion`, `id_usuario`, `id_riesgo`, `id_proyecto`, `id_iteracion`) VALUES
('Si alguien se enferma cerca de un hito importante, el equipo podría sobrecargarse. Aunque es poco probable, el impacto sería considerable', 5, 1, '2025-05-31', 4, 1, 1, 13),
('Nuestro equipo está teniendo problemas para estimar tareas. He visto que algunos compañeros están saturados de trabajo', 8, 2, '2025-05-31', 2, 2, 1, 13),
('El equipo sigue contando con alta experiencia pero el proyecto esta terminado', 8, 1, '2025-05-31', 6, 3, 1, 13),
('Nos estamos comunicando correctamente', 9, 1, '2025-05-31', 4, 4, 1, 13),
('Los examenes finales ya finalizaron', 1, 1, '2025-05-31', 2, 5, 1, 13),
('En la próxima revisión con el cliente, es casi seguro que pedirán cambios. Debemos reservar tiempo para ajustes', 7, 8, '2025-05-31', 6, 6, 1, 13);

-- Evaluaciones para Riesgos de Experiencia
INSERT INTO `evaluacion`(`descripcion`, `impacto`, `probabilidad`, `fecha_realizacion`, `id_usuario`, `id_riesgo`, `id_proyecto`, `id_iteracion`) VALUES
('La mayoria del equipo pudo experimentar las tecnologias utilizadas', 2, 1, '2025-05-31', 4, 7, 1, 13),
('Con la separacion de tareas correcta y con los recursos brindados, se evito este riesgo', 9, 1, '2025-05-31', 2, 8, 1, 13),
('Ya se finalizaron las funciones complejas, no requeria un gran nivel de conocimiento', 5, 1, '2025-05-31', 6, 9, 1, 13),
('El programador fue uno solo y formateo el codigo con una herramienta automatizada', 2, 1, '2025-05-31', 4, 10, 1, 13),
('Se establecieron las versiones correspondientes, todo el equipo esta claro con eso', 3, 1, '2025-05-31', 2, 11, 1, 13),
('En este punto del proyecto, contamos con experiencias de diferentes catedras por lo que mejoramos el analisis de proyectos y viabilidad', 5, 1, '2025-05-31', 6, 12, 1, 13),
('Hasta ultimo momento se detectaron algunos errores. Se solucionaron y se volvio a probar el software', 6, 2, '2025-05-31', 4, 13, 1, 13),
('No contamos con sistema de permisos', 1, 1, '2025-05-31', 2, 14, 1, 13),
('Ya iniciamos el proyecto desde la iteracion C4', 1, 1, '2025-05-31', 6, 15, 1, 13);

-- Evaluaciones para Riesgos Técnicos
INSERT INTO `evaluacion`(`descripcion`, `impacto`, `probabilidad`, `fecha_realizacion`, `id_usuario`, `id_riesgo`, `id_proyecto`, `id_iteracion`) VALUES
('Se rehizo el uargflow en react y php', 1, 1, '2025-05-31', 4, 16, 1, 13),
('No se usara un sistema de notificaciones', 1, 1, '2025-05-31', 2, 17, 1, 13);

-- Planes basados en el documento de seguimiento
INSERT INTO plan (descripcion, tipo, id_riesgo, id_proyecto, id_iteracion) VALUES
-- RK03 (id_riesgo=7)
('Buscar cursos de PHP disponibles en línea', 'minimizacion', 7, 1, 3),
('Implementar pequeños programas de prueba para practicar PHP', 'minimizacion', 7, 1, 3),
('Revisar código con IA para detectar errores sintácticos', 'contingencia', 7, 1, 4),

-- RK11 (id_riesgo=16)
('Realizar pruebas de integración controladas con datos de muestra', 'mitigacion', 16, 1, 3),
('Actualizar librerías para compatibilidad con PHP 8.3', 'contingencia', 16, 1, 3),

-- RK02 (id_riesgo=2)
('Configurar tablero Trello con columnas de progreso', 'mitigacion', 2, 1, 3),
('Realizar retrospectiva semanal de estimaciones', 'contingencia', 2, 1, 3),

-- RK08 (id_riesgo=12)
('Establecer checklist de calidad para revisiones de código', 'mitigacion', 12, 1, 3),
('Convocar reunión de emergencia para redistribución de tareas', 'contingencia', 12, 1, 3),

-- RK13 (id_riesgo=3)
('Documentar estructura de componentes en estándar PSR-12', 'mitigacion', 3, 1, 5),
('Asignar tareas de documentación a miembros secundarios', 'contingencia', 3, 1, 5),
('Crear lista de tareas de baja complejidad para nuevos desarrolladores', 'mitigacion', 3, 1, 8),

-- RK15 (id_riesgo=4)
('Enviar recordatorios de inicio de iteración 48h antes', 'mitigacion', 4, 1, 7),
('Ajustar fechas de entrega en documentos de planificación', 'contingencia', 4, 1, 7),

-- RK16 (id_riesgo=5)
('Crear calendario compartido con fechas de exámenes', 'minimizacion', 5, 1, 7),
('Extender duración de iteraciones durante periodo de exámenes', 'contingencia', 5, 1, 7),

-- RK17 (id_riesgo=15)
('Revisar documentos de especificación semanalmente', 'minimizacion', 15, 1, 7),
('Realizar demo quincenal con cliente para validaciones', 'contingencia', 15, 1, 8),

-- Planes adicionales para iteraciones recientes
('Implementar pruebas unitarias automatizadas para componentes críticos', 'mitigacion', 13, 1, 12),
('Crear ambiente de staging para validación con cliente', 'contingencia', 6, 1, 12),
('Realizar capacitación cruzada en componentes del sistema', 'minimizacion', 3, 1, 13),
('Desarrollar guía de transición para mantenimiento futuro', 'mitigacion', 15, 1, 13),
('Automatizar despliegue en ambiente de producción', 'contingencia', 9, 1, 13),
('Implementar sistema de monitoreo de rendimiento post-implementación', 'minimizacion', 17, 1, 13);


-- Tareas para los planes (estado = 0, fecha_fin_real = NULL)
INSERT INTO tarea (nombre, descripcion, estado, id_plan, fecha_inicio, fecha_fin, fecha_fin_real) VALUES
('Buscar cursos de PHP disponibles en línea', 'Buscar cursos de PHP disponibles en línea', '0', 1, '2024-09-25', '2024-10-11', NULL),
('Implementar pequeños programas de prueba para practicar PHP', 'Implementar pequeños programas de prueba para practicar PHP', '0', 2, '2024-09-25', '2024-10-11', NULL),
('Revisar código con IA para detectar errores sintácticos', 'Revisar código con IA para detectar errores sintácticos', '0', 3, '2024-10-12', '2024-10-29', NULL),
('Realizar pruebas de integración controladas con datos de muestra', 'Realizar pruebas de integración controladas con datos de muestra', '0', 4, '2024-09-25', '2024-10-11', NULL),
('Actualizar librerías para compatibilidad con PHP 8.3', 'Actualizar librerías para compatibilidad con PHP 8.3', '0', 5, '2024-09-25', '2024-10-11', NULL),
('Configurar tablero Trello con columnas de progreso', 'Configurar tablero Trello con columnas de progreso', '0', 6, '2024-09-25', '2024-10-11', NULL),
('Realizar retrospectiva semanal de estimaciones', 'Realizar retrospectiva semanal de estimaciones', '0', 7, '2024-09-25', '2024-10-11', NULL),
('Establecer checklist de calidad para revisiones de código', 'Establecer checklist de calidad para revisiones de código', '0', 8, '2024-09-25', '2024-10-11', NULL),
('Convocar reunión de emergencia para redistribución de tareas', 'Convocar reunión de emergencia para redistribución de tareas', '0', 9, '2024-09-25', '2024-10-11', NULL),
('Documentar estructura de componentes en estándar PSR-12', 'Documentar estructura de componentes en estándar PSR-12', '0', 10, '2024-10-30', '2024-11-08', NULL),
('Asignar tareas de documentación a miembros secundarios', 'Asignar tareas de documentación a miembros secundarios', '0', 11, '2024-10-30', '2024-11-08', NULL),
('Crear lista de tareas de baja complejidad para nuevos desarrolladores', 'Crear lista de tareas de baja complejidad para nuevos desarrolladores', '0', 12, '2025-01-28', '2025-02-11', NULL),
('Enviar recordatorios de inicio de iteración 48h antes', 'Enviar recordatorios de inicio de iteración 48h antes', '0', 13, '2025-01-18', '2025-01-27', NULL),
('Ajustar fechas de entrega en documentos de planificación', 'Ajustar fechas de entrega en documentos de planificación', '0', 14, '2025-01-18', '2025-01-27', NULL),
('Crear calendario compartido con fechas de exámenes', 'Crear calendario compartido con fechas de exámenes', '0', 15, '2025-01-18', '2025-01-27', NULL),
('Extender duración de iteraciones durante periodo de exámenes', 'Extender duración de iteraciones durante periodo de exámenes', '0', 16, '2025-01-18', '2025-01-27', NULL),
('Revisar documentos de especificación semanalmente', 'Revisar documentos de especificación semanalmente', '0', 17, '2025-01-18', '2025-01-27', NULL),
('Realizar demo quincenal con cliente para validaciones', 'Realizar demo quincenal con cliente para validaciones', '0', 18, '2025-01-28', '2025-02-11', NULL),
('Implementar pruebas unitarias automatizadas para componentes críticos', 'Implementar pruebas unitarias automatizadas para componentes críticos', '0', 19, '2025-05-10', '2025-05-28', NULL),
('Crear ambiente de staging para validación con cliente', 'Crear ambiente de staging para validación con cliente', '0', 20, '2025-05-10', '2025-05-28', NULL),
('Realizar capacitación cruzada en componentes del sistema', 'Realizar capacitación cruzada en componentes del sistema', '0', 21, '2025-05-29', '2025-06-12', NULL),
('Desarrollar guía de transición para mantenimiento futuro', 'Desarrollar guía de transición para mantenimiento futuro', '0', 22, '2025-05-29', '2025-06-12', NULL),
('Automatizar despliegue en ambiente de producción', 'Automatizar despliegue en ambiente de producción', '0', 23, '2025-05-29', '2025-06-12', NULL),
('Implementar sistema de monitoreo de rendimiento post-implementación', 'Implementar sistema de monitoreo de rendimiento post-implementación', '0', 24, '2025-05-29', '2025-06-12', NULL);

-- Asignación de participantes a cada riesgo (id_proyecto = 1)
INSERT INTO participante_riesgo (id_usuario, id_riesgo, id_proyecto) VALUES
  (2,  1, 1),
  (4,  1, 1),
  (6,  2, 1),
  (4,  2, 1),
  (2,  3, 1),
  (6,  3, 1),
  (4,  4, 1),
  (2,  5, 1),
  (6,  5, 1),
  (2,  6, 1),
  (4,  7, 1),
  (6,  7, 1),
  (2,  8, 1),
  (4,  8, 1),
  (6,  9, 1),
  (2,  9, 1),
  (4, 10, 1),
  (6, 10, 1),
  (2, 11, 1),
  (4, 12, 1),
  (6, 12, 1),
  (2, 13, 1),
  (6, 13, 1),
  (4, 14, 1),
  (2, 15, 1),
  (6, 15, 1),
  (4, 16, 1),
  (6, 16, 1),
  (2, 17, 1),
  (4, 17, 1);

-- Asignación de participantes a cada tarea (id_tarea = 1–24)
INSERT INTO participante_tarea (id_usuario, id_tarea) VALUES
  (2,  1),
  (4,  1),
  (6,  2),
  (4,  2),
  (2,  3),
  (6,  3),
  (4,  4),
  (6,  4),
  (2,  5),
  (4,  5),
  (6,  6),
  (2,  7),
  (4,  7),
  (6,  8),
  (2,  8),
  (4,  9),
  (6,  9),
  (2, 10),
  (4, 10),
  (6, 11),
  (2, 11),
  (4, 12),
  (6, 12),
  (2, 13),
  (4, 13),
  (6, 14),
  (2, 14),
  (4, 15),
  (6, 15),
  (2, 16),
  (4, 16),
  (6, 17),
  (2, 17),
  (4, 18),
  (6, 18),
  (2, 19),
  (4, 19),
  (6, 20),
  (2, 20),
  (4, 21),
  (6, 21),
  (2, 22),
  (4, 22),
  (6, 23),
  (2, 23),
  (4, 24),
  (6, 24);
