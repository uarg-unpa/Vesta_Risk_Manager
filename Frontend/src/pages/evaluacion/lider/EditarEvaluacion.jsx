import React, { useState } from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import Contenedor from "../../../components/Contenedor";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { crearEvaluacion, editarEvaluacion } from "../../../services/evaluacion";
import { useUsuario } from "../../../context/usuarioContext";
import { formatearFecha, verificarError } from "../../../utils/funciones";

export default function EditarEvaluacion() {
  const { evaluacion } = useLoaderData();
  
  const navigate = useNavigate();

  const { id_proyecto, id_evaluacion } = useParams();

  const { usuario } = useUsuario();

  const [formData, setFormData] = useState({
    impacto: evaluacion.impacto,
    probabilidad: evaluacion.probabilidad,
    descripcion: evaluacion.descripcion,
  });

  const [error, setError] = useState({
    impacto: false,
    probabilidad: false,
    descripcion: false,
  });

  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));

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

  const handleClick = async () => {
    const comprobacionError = {
      impacto: formData.impacto < 1 || formData.impacto === null,
      probabilidad: formData.probabilidad < 1 || formData.probabilidad === null,
      descripcion: formData.descripcion.length === 0,
    };

    setError(comprobacionError);

    const comprobacion = verificarError(comprobacionError);
    if (!comprobacion) {
      formData.id_iteracion = evaluacion.id_iteracion;
      formData.responsable = usuario.id_usuario;
      const resultado = await editarEvaluacion(
        id_proyecto,
        evaluacion.id_riesgo,
        id_evaluacion,
        formData
      );
      if(resultado){
        navigate(`/inicio/proyecto/lider/${proyecto.id_proyecto}/evaluaciones/actual`, {
          state: { mensaje: "Evaluacion editada con éxito" },
        });
      }
    }
  };
    return (
      <>
        <NavegadorLider />
        <Contenedor>
          <>
            <h3>
              {proyecto.nombre} - Editar evaluación del riesgo {evaluacion.id_riesgo > 9 ? "RK" : "RK0"}{evaluacion.id_riesgo}
            </h3>
          </>
          <Form>
            <Form.Group>
              <Form.Label>Id del riesgo</Form.Label>
              <Form.Control
                disabled
                value={`RK${
                  evaluacion.id_riesgo < 10 ? "0" + evaluacion.id_riesgo : evaluacion.id_riesgo
                }`}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción del riesgo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                disabled
                value={evaluacion.descripcion_riesgo}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Iteración</Form.Label>
              <Form.Control
                disabled
                value={`${evaluacion.nombre_iteracion} - ${formatearFecha(
                  evaluacion.fecha_inicio_iteracion
                )} al ${formatearFecha(evaluacion.fecha_fin_iteracion)}`}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Impacto</Form.Label>
              <Form.Select
                name="impacto"
                value={formData.impacto}
                onChange={handleChangeSelect}
                isInvalid={error.impacto}
              >
                <option value={0}>Ingrese el impacto del riesgo</option>
                <option value={1}>1 - Bajo</option>
                <option value={2}>2 - Bajo</option>
                <option value={3}>3 - Bajo</option>
                <option value={4}>4 - Moderado</option>
                <option value={5}>5 - Moderado</option>
                <option value={6}>6 - Moderado</option>
                <option value={7}>7 - Significante</option>
                <option value={8}>8 - Significante</option>
                <option value={9}>9 - Alto</option>
                <option value={10}>10 - Alto</option>
              </Form.Select>
              {error.impacto && (
                <Form.Text className="text-danger">
                  Seleccione el impacto del riesgo.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Probabilidad</Form.Label>
              <Form.Select
                name="probabilidad"
                value={formData.probabilidad}
                onChange={handleChangeSelect}
                isInvalid={error.probabilidad}
              >
                <option value={0}>
                  Ingrese la probabilidad de que el riesgo ocurra
                </option>
                <option value={1}>0 ~ 10%</option>
                <option value={2}>10% ~ 20%</option>
                <option value={3}>20% ~ 30%</option>
                <option value={4}>30% ~ 40%</option>
                <option value={5}>40% ~ 50%</option>
                <option value={6}>50% ~ 60%</option>
                <option value={7}>60% ~ 70%</option>
                <option value={8}>70% ~ 80%</option>
                <option value={9}>80% ~ 90%</option>
                <option value={10}>90% ~ 100%</option>
              </Form.Select>
              {error.probabilidad && (
                <Form.Text className="text-danger">
                  Seleccione la probabilidad del riesgo.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Justificación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese la justificación de la evaluacion realizada"
                name="descripcion"
                onChange={handleChangeControl}
                value={formData.descripcion}
                isInvalid={error.descripcion}
              />
              {error.descripcion && (
                <Form.Text className="text-danger">
                  Justifique la elección del impacto y la probabilidad del
                  riesgo.
                </Form.Text>
              )}
            </Form.Group>
          </Form>

          <>
            <Button
              variant="outline-success"
              className="mx-1"
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
              Confirmar
            </Button>
            <Button
              variant="outline-danger"
              className="mx-1"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/lider/${proyecto.id_proyecto}/evaluaciones/actual`
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
