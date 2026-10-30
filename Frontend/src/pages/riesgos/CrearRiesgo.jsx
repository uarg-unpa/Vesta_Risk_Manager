import React, { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import NavegadorLider from "../../components/NavegadorLider";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { crearRiesgo } from "../../services/riesgos";
import { formatearFecha, verificarError } from "../../utils/funciones";

export default function CrearRiesgo() {
  const { proyecto, iteracion } = useLoaderData();

  const navigate = useNavigate();
  const [error, setError] = useState({
    descripcion: false,
    categoria: false,
    responsables: false,
  });

  const [formData, setFormData] = useState({
    descripcion: "",
    categoria: 0,
    responsables: [],
  });

  const handleChangeControl = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: false });
  };

  const handleChangeSelect = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: false });
  };

  const handleChangeCheck = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevFormData) => {
      if (checked) {
        return {
          ...prevFormData,
          [name]: [...prevFormData.responsables, value],
        };
      } else {
        return {
          ...prevFormData,
          [name]: prevFormData.responsables.filter(
            (responsable) => responsable !== value
          ),
        };
      }
    });
    setError({ ...error, [name]: false });
  };

  const volverTablaRiesgo = () => {
    navigate(
      `/inicio/proyecto/${
        location.pathname.includes("lider") ? "lider" : "desarrollador"
      }/${proyecto.id_proyecto}/riesgos`,
      { state: { mensaje: "Riesgo creado con exito" } }
    );
  };

  const clickBotonCrear = async () => {
    const comprobacionError = {
      descripcion: formData.descripcion.length === 0,
      categoria: formData.categoria <= 0,
      responsables: formData.responsables.length === 0,
    };
    setError(comprobacionError);

    if (verificarError(comprobacionError)) {
      return;
    }

    const resultado = await crearRiesgo(proyecto.id_proyecto, formData);

    if (resultado) {
      volverTablaRiesgo();
    }
  };

  const location = useLocation();
  const comprobacionLider = location.pathname.includes("lider");

  return (
    <>
      <NavegadorLider />
      <Contenedor>
        <>
          <h3>{proyecto.nombre} - Crear Riesgo</h3>
          <>
            <h4>
              {iteracion.nombre}
              {" - "}
              {formatearFecha(iteracion.fecha_inicio)}
              {" al "}
              {formatearFecha(iteracion.fecha_fin)}
            </h4>
          </>
          <p>
            Complete los campos a continuaci&oacute;n. Luego, presione el
            bot&oacute;n <b>Confirmar</b>.<br />
            Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
          </p>
        </>
        <Form>
          <h4>Propiedades</h4>
          <Form.Group>
            <Form.Label className="mb-0">Descripción</Form.Label>
            <br />
            <Form.Text className="ms-2">
              <b>Sugerencia</b>:{" "}
              {
                "Dada/s <una o más causas>, podría ocurrir <el riesgo>, lo que conduciría a <uno o más efectos>."
              }
            </Form.Text>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción del riesgo"
              onChange={handleChangeControl}
              value={formData.descripcion}
              name="descripcion"
              isInvalid={error.descripcion}
            />
            {error.descripcion && (
              <Form.Text className="text-danger">
                Revise que la descripción no este vacía.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={formData.categoria}
              onChange={handleChangeSelect}
              name="categoria"
              isInvalid={error.categoria}
            >
              <option value={0}>Elija una categoría</option>
              {proyecto.categorias.map((item, key) => (
                <option
                  key={key}
                  value={item.id_categoria}
                  selected={formData.categoria === item.id_categoria}
                >
                  {item.nombre}
                </option>
              ))}
            </Form.Select>
            {error.categoria && (
              <Form.Text className="text-danger">
                Seleccione una categoría válida.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Responsable</Form.Label>
            {proyecto.participantes.map((item, key) => (
              <Form.Check
                key={key}
                type="checkbox"
                label={item.nombre}
                value={item.id_usuario}
                name="responsables"
                onChange={handleChangeCheck}
                isInvalid={error.responsables}
              />
            ))}
            {error.responsables && (
              <Form.Text className="text-danger">
                Seleccione al menos un responsable.
              </Form.Text>
            )}
          </Form.Group>
        </Form>
        <>
          <Button
            variant="outline-success"
            className="mx-1"
            onClick={clickBotonCrear}
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
            Confirmar
          </Button>
          <Button
            variant="outline-danger"
            className="mx-1"
            onClick={() => {
              navigate(
                `/inicio/proyecto/${
                  comprobacionLider ? "lider" : "desarrollador"
                }/${proyecto.id_proyecto}/riesgos`
              );
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
            Cancelar
          </Button>
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
