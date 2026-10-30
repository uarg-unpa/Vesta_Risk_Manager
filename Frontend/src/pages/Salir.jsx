import React, { useEffect } from "react";
import Navegador from "../components/Navegador";
import Footer from "../components/Footer";
import Contenedor from "../components/Contenedor";
import { Alert, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Salir() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear()
  }, []);
  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Salir del Sistema</h3>
        <>
          <Alert variant="success">
            Ha salido del sistema Vesta Risk Manager.
          </Alert>
          <p>Elija una de las opciones a continuación:</p>
          <ul>
            <li>
              <b>Volver a ingresar</b>: Regresar al sistema.
            </li>
            <li>
              <b>Ir a e-mail</b>: Abre el correo electrónico.
            </li>
          </ul>
          <hr />
          <Card.Text style={{ fontWeight: "bold", fontSize: "1.5em" }}>
            Opciones
          </Card.Text>
          <Button
            className="m-1"
            onClick={() => {
              navigate("/");
            }}
          >
            Volver a ingresar
          </Button>
          <Button
            className="m-1"
            onClick={() => {
              window.location.href = "http://www.gmail.com";
            }}
          >
            Ir a email
          </Button>
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
