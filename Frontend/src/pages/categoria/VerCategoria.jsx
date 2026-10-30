import React from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import BotonSalir from "../../components/BotonSalir";
import { useLoaderData } from "react-router-dom";

export default function VerCategoria() {
  const { categoria } = useLoaderData();

  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Propiedades de la Categor&iacute;a</h3>
        <>
          <h4>Nombre</h4>
          <p>{categoria.nombre}</p>
          <hr />
          <h4>Descripci&oacute;n</h4>
          <p>{categoria.descripcion}</p>

          <hr />
          <h5>Opciones</h5>
          <BotonSalir ruta={"/inicio/categorias"} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
