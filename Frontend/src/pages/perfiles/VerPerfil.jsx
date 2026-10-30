import React from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import BotonSalir from "../../components/BotonSalir";
import { obtenerPerfilId } from "../../services/usuarios";
import { useLoaderData } from "react-router-dom";

export async function cargarPerfilId({ params }) {
  const perfil = await obtenerPerfilId(params.id_perfil);
  return { perfil };
}

export default function VerPerfil() {
  const { perfil } = useLoaderData();

  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Propiedades del Perfil</h3>
        <>
          <h4>Nombre</h4>
          <p>{perfil.nombre}</p>
          <hr />
          <h4>Permisos</h4>
          {perfil.permisos.map((item, key) => (
            <p key={key}>{item.nombre}</p>
          ))}
          {/* <p>{usuario.nombre_perfil}</p> */}

          <hr />
          <h5>Opciones</h5>
          <BotonSalir ruta={"/inicio/perfiles"} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
