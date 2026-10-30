import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card, Table, Pagination, InputGroup } from "react-bootstrap";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Contenedor from "../../components/Contenedor";
import Footer from "../../components/Footer";
import { obtenerRiesgosProyecto } from "../../services/riesgos";
import { crearIncidencia } from "../../services/incidencia";
import NavegadorLider from "../../components/NavegadorLider";
import { useUsuario } from "../../context/usuarioContext";
import { formatearFecha } from "../../utils/funciones";

export default function CrearIncidencia() {
  const navigate = useNavigate();
  const { iteracion } = useLoaderData();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const id_proyecto = proyecto.id_proyecto;
  const { usuario } = useUsuario();

  const location = useLocation()

  const ruta = location.state?.ruta
  
  const [formData, setFormData] = useState({
    descripcion: "",
    gravedad: "",
    responsable: usuario.id_usuario,
    riesgo: null,
  });
  const [error, setError] = useState({
    descripcion: false,
    gravedad: false,
    responsable: false,
  });
  const [riesgos, setRiesgos] = useState([]);
  const [busquedaRiesgo, setBusquedaRiesgo] = useState("");
  const [riesgosFiltrados, setRiesgosFiltrados] = useState([]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(prev => ({
      ...prev,
      [name]: false,
    }));
    
  };


  // Selección de gravedad
  const handleSeveritySelect = (gravedad) => {
    setFormData(prev => ({
      ...prev,
      gravedad: gravedad,
    }));
    setError(prev => ({
      ...prev,
      gravedad: false,
    }));
  };

  const handleClick = async () => {
    // Validate form
    const comprobacionError = {
      descripcion: !formData.descripcion.trim(),
      gravedad: !formData.gravedad,
      riesgo: !formData.riesgo,
    };

    // Set errors
    setError(comprobacionError);

    // Check if there are any errors
    const hasErrors = Object.values(comprobacionError).some(error => error);

    if (hasErrors) {
      return;
    }

    try {
      const resultado = await crearIncidencia(id_proyecto, formData);

      if (resultado) {
        navigate(ruta, {
          state: { mensaje: "Incidencia creada con éxito" },
        });
      }
    } catch (err) {
      console.error("Error creating incident:", err);
    }
  };

// Obtener los riesgos al cargar el componente
useEffect(() => {
  const cargarRiesgos = async () => {
    try {
      const riesgosData = await obtenerRiesgosProyecto(id_proyecto);
      setRiesgos(riesgosData);
      setRiesgosFiltrados(riesgosData);
    } catch (err) {
      console.error("Error al cargar los riesgos:", err);
    }
  };
  
  cargarRiesgos();
}, [id_proyecto]);

// Filtrar riesgos según búsqueda
useEffect(() => {
  if (busquedaRiesgo.trim() === "") {
    setRiesgosFiltrados(riesgos);
  } else {
    const filtrados = riesgos.filter(riesgo => 
      riesgo.descripcion.toLowerCase().includes(busquedaRiesgo.toLowerCase())
    );
    setRiesgosFiltrados(filtrados);
  }
}, [busquedaRiesgo, riesgos]);

// Manejar selección de riesgos
const handleRiesgoSelection = (id_riesgo) => {
  // Si ya estaba seleccionado, lo quita
  if (formData.riesgo === id_riesgo) {
    setFormData(prev => ({
      ...prev,
      riesgo: null
    }));
  } else {
    // Si no estaba seleccionado o había otro, lo establece
    setFormData(prev => ({
      ...prev,
      riesgo: id_riesgo
    }));
  }
};

// Eliminar riesgo de la selección
// const eliminarRiesgoSeleccionado = (id_riesgo) => {
//   setFormData(prev => ({
//     ...prev,
//     riesgos: prev.riesgos.filter(id => id !== id_riesgo)
//   }));
// };

  return (
    <>
      <NavegadorLider />
      <Contenedor>
        <>
          <h3>{proyecto.nombre} - Crear Incidencia</h3>
          <h4>{iteracion.nombre} - {formatearFecha(iteracion.fecha_inicio)} al {formatearFecha(iteracion.fecha_fin)}</h4>
          <p>
            Complete los campos a continuaci&oacute;n. Luego, presione el
            bot&oacute;n <b>Confirmar</b>.<br />
            Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
          </p>
        </>
        <Form>
          <h4>Propiedades</h4>
          
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción de la incidencia"
              name="descripcion"
              onChange={handleChange}
              value={formData.descripcion}
              isInvalid={error.descripcion}
            />
            {error.descripcion && (
              <Form.Text className="text-danger">
                La descripción no puede estar vacía.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gravedad</Form.Label>
            <Row>
              <Col xs={4}>
                <Card 
                  border={formData.gravedad === "Baja" ? "success" : 'secondary'}
                  className={`mb-3 ${formData.gravedad === "Baja" ? `border-3` : ''}`}
                  onClick={() => handleSeveritySelect("Baja")}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className={`text-center text-success`}>
                    <Card.Title>Baja</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={4}>
                <Card 
                  border={formData.gravedad === "Media" ? "warning" : 'secondary'}
                  className={`mb-3 ${formData.gravedad === "Media" ? `border-3` : ''}`}
                  onClick={() => handleSeveritySelect("Media")}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className={`text-center text-warning`}>
                    <Card.Title>Media</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={4}>
                <Card 
                  border={formData.gravedad === "Alta" ? "danger" : 'secondary'}
                  className={`mb-3 ${formData.gravedad === "Alta" ? `border-3` : ''}`}
                  onClick={() => handleSeveritySelect("Alta")}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className={`text-center text-danger`}>
                    <Card.Title>Alta</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {error.gravedad && (
              <Form.Text className="text-danger">
                Debe seleccionar un nivel de gravedad.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
          <Form.Label>Riesgo Relacionado</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Buscar riesgo por nombre..."
              value={busquedaRiesgo}
              onChange={(e) => setBusquedaRiesgo(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </InputGroup>

          {error.riesgo && (
            <Form.Text className="text-danger">
              Debe seleccionar un riesgo.
            </Form.Text>
          )}

          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>Riesgos disponibles</div>
              <div className="badge bg-primary">
                {formData.riesgo ? "1 seleccionado" : "0 seleccionados"}
              </div>
            </Card.Header>
            <Card.Body>
              {riesgosFiltrados.map(riesgo => (
                <div key={riesgo.id_riesgo} className="mb-2 d-flex justify-content-between align-items-center">
                  <div>
                    <Form.Check
                      type="radio"
                      value={riesgo.id_riesgo}
                      label={riesgo.descripcion}
                      checked={formData.riesgo === riesgo.id_riesgo}
                      onChange={() => handleRiesgoSelection(riesgo.id_riesgo)}
                    />
                  </div>
                </div>
              ))}
              {riesgosFiltrados.length === 0 && (
                <div className="text-center text-muted">
                  No se encontraron riesgos
                </div>
              )}
            </Card.Body>
          </Card>
        </Form.Group>

          <div>
            <Button
              variant="outline-success"
              className="mx-1"
              onClick={handleClick}
            >
              ✓ Confirmar
            </Button>
            <Button
              variant="outline-danger"
              className="mx-1"
              onClick={() => navigate(ruta)}
            >
              × Cancelar
            </Button>
          </div>
        </Form>
      </Contenedor>
      <Footer />
    </>
  );
}