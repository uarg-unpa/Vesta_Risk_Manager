import React from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import BotonSalir from "../../components/BotonSalir";
import { useLoaderData } from "react-router-dom";

export default function VerUsuario() {
  const { usuario } = useLoaderData();

  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Propiedades del Usuario</h3>
        <>
          <h4>Nombre</h4>
          <p>{usuario.nombre_usuario}</p>
          <hr />
          <h4>Email</h4>
          <p>{usuario.email}</p>
          <hr />
          <h4>Perfil</h4>
          <p>{usuario.nombre_perfil}</p>

          <hr />
          <h5>Opciones</h5>
          <BotonSalir ruta={"/inicio/usuarios"} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
