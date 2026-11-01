import React, { useState } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "../../components/Footer";
import Navegador from "../../components/Navegador";
import { Button, Card, Col, Form, Row } from "@/components/ui";
import { useLoaderData, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { actualizarIncidencia } from "../../services/incidencia";

const normalizarGravedad = (gravedad) => {
  const valores = {
    baja: "Baja",
    media: "Media",
    intermedia: "Media",
    alta: "Alta",
  };

  return valores[String(gravedad ?? "").toLowerCase()] ?? gravedad ?? "";
};

export default function ModificarIncidencia() {
  const { incidencia } = useLoaderData();
  const { id_incidencia, id_proyecto } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tipoUsuario = location.pathname.includes("desarrollador") ? "desarrollador" : "lider";
  const ruta = location.state?.ruta || `/inicio/proyecto/${tipoUsuario}/${id_proyecto}/monitoreo/incidencias`;

  const [formData, setFormData] = useState({
    descripcion: incidencia.descripcion ?? "",
    gravedad: normalizarGravedad(incidencia.gravedad),
  });
  const [error, setError] = useState({ descripcion: false, gravedad: false });
  const [botonPresionado, setBotonPresionado] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleSeveritySelect = (gravedad) => {
    setFormData((prev) => ({ ...prev, gravedad }));
    setError((prev) => ({ ...prev, gravedad: false }));
  };

  const handleClick = async () => {
    const comprobacionError = {
      descripcion: !formData.descripcion.trim(),
      gravedad: !formData.gravedad,
    };
    setError(comprobacionError);

    if (Object.values(comprobacionError).some(Boolean)) return;

    setBotonPresionado(true);
    try {
      const resultado = await actualizarIncidencia(id_incidencia, formData);
      if (resultado) {
        navigate(ruta, {
          state: { mensaje: "Incidencia modificada con éxito" },
        });
      }
    } finally {
      setBotonPresionado(false);
    }
  };

  return (
    <>
      <Navegador />
      <Contenedor>
        <>
          <h3>Actualizar Incidencia</h3>
          <p>
            Complete los campos a continuaci&oacute;n. Luego, presione el
            bot&oacute;n <b>Confirmar</b>.<br />
            Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
          </p>
        </>
        <Form onSubmit={(event) => event.preventDefault()}>
          <h4>Propiedades</h4>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={handleChange}
              placeholder="Ingrese la descripción de la incidencia"
              name="descripcion"
              value={formData.descripcion}
              isInvalid={error.descripcion}
            />
            {error.descripcion && (
              <Form.Text className="text-red-600">
                La descripción no puede estar vacía.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Gravedad</Form.Label>
            <Row>
              <Col xs={4}>
                <Card
                  className={`mb-3 border-2 ${formData.gravedad === "Baja" ? "border-emerald-600" : "border-slate-300"}`}
                  onClick={() => handleSeveritySelect("Baja")}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="text-center text-emerald-600">
                    <Card.Title className="!text-emerald-600">Baja</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={4}>
                <Card
                  className={`mb-3 border-2 ${formData.gravedad === "Media" ? "border-amber-500" : "border-slate-300"}`}
                  onClick={() => handleSeveritySelect("Media")}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="text-center text-amber-600">
                    <Card.Title className="!text-amber-600">Media</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={4}>
                <Card
                  className={`mb-3 border-2 ${formData.gravedad === "Alta" ? "border-red-600" : "border-slate-300"}`}
                  onClick={() => handleSeveritySelect("Alta")}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="text-center text-red-600">
                    <Card.Title className="!text-red-600">Alta</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {error.gravedad && (
              <Form.Text className="text-red-600">
                Seleccione la gravedad de la incidencia.
              </Form.Text>
            )}
          </Form.Group>
        </Form>
        <Button
          type="button"
          variant="outline-success"
          className="mx-1"
          onClick={handleClick}
          disabled={botonPresionado}
        >
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
          Confirmar
        </Button>
        <Button
          type="button"
          variant="outline-danger"
          className="mx-1"
          onClick={() => navigate(ruta)}
        >
          <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
          Cancelar
        </Button>
      </Contenedor>
      <Footer />
    </>
  );
}
