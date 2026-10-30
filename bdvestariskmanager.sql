drop database if exists bdvestariskmanager; 
create database if not exists bdvestariskmanager;
use bdvestariskmanager;

create table if not exists perfil (
	id_perfil int not null auto_increment,
    nombre varchar(30) not null,
    primary key (id_perfil)
);
create table if not exists usuario (
	id_usuario int not null auto_increment,
    nombre varchar(30) not null,
    email varchar(64) not null,
    primary key (id_usuario),
    unique key UN_USUARIO (nombre, email)
);

create table if not exists usuario_perfil (
	id_usuario int not null,
    id_perfil int not null,
    primary key (id_usuario, id_perfil),
    constraint fk_ur_perfil foreign key (id_perfil) references perfil (id_perfil) ON DELETE NO ACTION ON UPDATE NO ACTION,
    constraint fk_ur_usuario foreign key (id_usuario) references usuario (id_usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);

create table if not exists categoria (
	id_categoria int not null auto_increment,
    nombre varchar(40) not null,
    descripcion varchar(255) not null,
    estado enum("activo", "inactivo") not null default "activo",
    version int not null default 1,
    primary key (id_categoria)
);

create table if not exists proyecto (
	id_proyecto int not null auto_increment,
    nombre varchar(30) not null,
    descripcion text not null,
    estado enum ("activo", "inactivo", "finalizado", "abandonado") not null,
    fecha_inicio date, 
    fecha_fin date,
    primary key (id_proyecto)
);

create table if not exists iteracion (
	id_iteracion int not null auto_increment,
    nombre varchar(60) not null,
    fecha_inicio date not null,
    fecha_fin date not null,
    id_proyecto int not null,
    primary key (id_iteracion),
    constraint fk_iteracion_proyecto foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade on update cascade
);

create table if not exists riesgo (
	id_riesgo int not null,
    descripcion text not null,
    factor_riesgo int null,
    fecha_creacion datetime not null default current_timestamp,
    id_categoria int not null,
    id_proyecto int not null,
    primary key (id_proyecto, id_riesgo),
    constraint fk_riesgo_proyecto foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade on update cascade,
    constraint fk_riesgo_categoria foreign key (id_categoria) references categoria (id_categoria) on delete no action on update no action
);

create table if not exists incidencia (
	id_incidencia int not null auto_increment,
    descripcion text not null,
    gravedad enum ("Alta","Media","Baja") not null,
    fecha_ocurrencia datetime not null default current_timestamp,
    id_riesgo int not null,
    id_usuario int null,
    id_proyecto int not null, 
    primary key (id_incidencia),
    constraint fk_incidencia_riesgo foreign key (id_proyecto, id_riesgo) references riesgo (id_proyecto, id_riesgo) on delete CASCADE on update no action,
    constraint fk_incidencia_usuario foreign key (id_usuario) references usuario (id_usuario) on delete no action on update no action
);

create table if not exists evaluacion (
	id_evaluacion int not null auto_increment,
    descripcion text not null,
    impacto enum ("1","2","3","4","5","6","7","8","9","10") not null,
    probabilidad enum ("1","2","3","4","5","6","7","8","9","10") not null,
    fecha_realizacion datetime not null default current_timestamp,
    id_usuario int null,
    id_riesgo int not null,
    id_proyecto int not null,
    id_iteracion int not null,
    primary key (id_evaluacion),
    constraint fk_evaluacion_usuario foreign key (id_usuario) references usuario (id_usuario) on delete no action on update cascade,
    constraint fk_evaluacion_riesgo foreign key (id_proyecto, id_riesgo) references riesgo (id_proyecto, id_riesgo) on delete cascade on update cascade,
    constraint fk_evaluacion_iteracion foreign key (id_iteracion) references iteracion (id_iteracion) on delete cascade on update cascade
);

create table if not exists plan (
	id_plan int not null auto_increment,
    descripcion text not null,
    tipo enum ("minimizacion", "mitigacion", "contingencia") not null,
    id_riesgo int not null,
    id_proyecto int not null,
    id_iteracion int not null,
    primary key (id_plan),
    constraint fk_plan_riesgo foreign key (id_proyecto, id_riesgo) references riesgo (id_proyecto, id_riesgo) on delete cascade on update cascade,
    constraint fk_plan_iteracion foreign key (id_iteracion) references iteracion (id_iteracion) on delete cascade on update cascade
);

create table if not exists tarea (
	id_tarea int not null auto_increment,
    nombre varchar(80) not null,
    descripcion text not null,
    estado enum ("1", "0") not null comment "1: completada, 0: no completada",
    id_plan int not null,
    fecha_inicio date not null,
    fecha_fin date not null,
    fecha_fin_real date,
    primary key (id_tarea),
    constraint fk_tarea_plan foreign key (id_plan) references plan (id_plan) on delete cascade on update cascade
);

create table if not exists proyecto_participante(
	id_proyecto int not null,
    id_usuario int,
    rol enum ("Lider del proyecto", "Desarrollador") not null,
    primary key (id_proyecto, id_usuario),
    constraint fk_pp_proyecto foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade on update cascade,
    constraint fk_pp_participante foreign key (id_usuario) references usuario (id_usuario) on delete cascade on update cascade
);

create table if not exists participante_riesgo(
	id_usuario int,
    id_riesgo int not null,
    id_proyecto int not null,
    primary key (id_usuario, id_riesgo, id_proyecto),
    constraint fk_pt_usuario foreign key (id_usuario) references usuario (id_usuario) on delete cascade on update cascade,
    constraint fk_pt_riesgo foreign key (id_proyecto, id_riesgo) references riesgo (id_proyecto, id_riesgo) on delete cascade on update cascade
);

create table if not exists participante_tarea(
	id_usuario int,
    id_tarea int not null,
    primary key (id_usuario, id_tarea),
    constraint fk_pt_participante foreign key (id_usuario) references usuario (id_usuario) on delete cascade on update cascade,
    constraint fk_pt_tarea foreign key (id_tarea) references tarea (id_tarea) on delete cascade on update cascade
);

create table if not exists proyecto_categoria(
	id_proyecto int not null,
    id_categoria int not null,
    primary key (id_proyecto, id_categoria),
    constraint fk_pc_proyecto foreign key (id_proyecto) references proyecto (id_proyecto) on delete cascade on update cascade,
    constraint fk_pc_categoria foreign key (id_categoria) references categoria (id_categoria) on delete cascade on update cascade
);
DELIMITER //

CREATE TRIGGER before_insert_riesgo
BEFORE INSERT ON riesgo
FOR EACH ROW
BEGIN
    DECLARE max_id INT;

    -- Obtener el último id_riesgo en el mismo id_proyecto
    SELECT COALESCE(MAX(id_riesgo) + 1, 1) INTO max_id
    FROM riesgo WHERE id_proyecto = NEW.id_proyecto;

    -- Asignar el valor calculado
    SET NEW.id_riesgo = max_id;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_insert_evaluacion
BEFORE INSERT ON evaluacion
FOR EACH ROW
BEGIN
	UPDATE riesgo
	SET factor_riesgo = NEW.impacto * NEW.probabilidad
	WHERE id_riesgo = NEW.id_riesgo and id_proyecto = NEW.id_proyecto;
END;
//

DELIMITER ;
CREATE INDEX idx_riesgo_proyecto ON riesgo (id_proyecto);
CREATE INDEX idx_riesgo_categoria ON riesgo (id_categoria);
CREATE INDEX idx_participante_riesgo ON participante_riesgo (id_riesgo, id_usuario);
CREATE INDEX idx_evaluacion ON evaluacion (id_riesgo, id_iteracion);
CREATE INDEX idx_plan ON plan (id_riesgo, id_iteracion, tipo);