import { useRef } from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import {
  Alert,
  Card,
  CardTitle,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from "@/components/ui";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { useLoaderData } from "react-router-dom";
import MantrizTonji from "../../../components/MatrizTonji";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/BotonDescarga.css";
import { useUsuario } from "../../../context/usuarioContext";
import { useState } from "react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VerProyectoLider() {
  const grafico_evolucion = useRef(null);
  const grafico_resumen = useRef(null);
  const grafico_matriz = useRef(null);
  const { datosRiesgos: datosRiesgosLoader = {}, iteracion, proyecto: proyectoLoader } = useLoaderData();
  const datosRiesgos = datosRiesgosLoader ?? {};
  const {
    datos_proyecto,
    iteraciones,
    categorias,
    datos_evaluacion,
    evaluacion_tongji,
    datos_telaraña,
  } = datosRiesgos;

  const ultimasIteraciones = (iteraciones ?? [])
    .map((item) => item.nombre)
    .reverse();
  const [iteracionesSeleccionadas, setIteracionesSeleccionadas] =
    useState(ultimasIteraciones);

  const categoriasProyecto = (categorias ?? []).map((item) => item.nombre);
  const datosTelarañaFormateados = (datos_telaraña ?? []).map(
    (item) => item.total_riesgo
  );

  const datos_evaluacion_reversa = [...(datos_evaluacion ?? [])].reverse();
  const datos_bajo = datos_evaluacion_reversa.map((item) => {
    return item[0].cantidad;
  });

  const datos_medio = datos_evaluacion_reversa.map((item) => {
    return item[1].cantidad;
  });

  const datos_alto = datos_evaluacion_reversa.map((item) => {
    return item[2].cantidad;
  });

  const datos_critico = datos_evaluacion_reversa.map((item) => {
    return item[3].cantidad;
  });

  const [datosBajos, setDatosBajos] = useState(datos_bajo);
  const [datosMedio, setDatosMedio] = useState(datos_medio);
  const [datosAlto, setDatosAlto] = useState(datos_alto);
  const [datosCritico, setDatosCritico] = useState(datos_critico);

  const puntos = (evaluacion_tongji ?? []).map((item) => ({
    x: parseInt(item.x),
    y: parseInt(item.y),
    label: item.label > 9 ? `RK${item.label}` : `RK0${item.label}`,
  }));

  const proyectoGuardado = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const proyecto = proyectoLoader ?? proyectoGuardado ?? { nombre: "Proyecto" };

  const toggleIteracion = (nombreIteracion) => {
    const index = iteracionesSeleccionadas.indexOf(nombreIteracion);
    setIteracionesSeleccionadas((prevSeleccionadas) => {
      const yaEsta = prevSeleccionadas.includes(nombreIteracion);
      let nuevaSeleccionadas;
      let nuevosDatosBajos = [...datosBajos];
      let nuevosDatosMedio = [...datosMedio];
      let nuevosDatosAlto = [...datosAlto];
      let nuevosDatosCritico = [...datosCritico];

      if (yaEsta) {
        nuevaSeleccionadas = prevSeleccionadas.filter(
          (i) => i !== nombreIteracion
        );

        nuevosDatosBajos.splice(index, 1);
        nuevosDatosMedio.splice(index, 1);
        nuevosDatosAlto.splice(index, 1);
        nuevosDatosCritico.splice(index, 1);
      } else {
        nuevaSeleccionadas = [...prevSeleccionadas, nombreIteracion];
        nuevaSeleccionadas = ultimasIteraciones.filter((iter) =>
          nuevaSeleccionadas.includes(iter)
        );

        // Recalcular los datos según el orden
        nuevosDatosBajos = nuevaSeleccionadas.map(
          (iter) => datos_bajo[ultimasIteraciones.indexOf(iter)]
        );
        nuevosDatosMedio = nuevaSeleccionadas.map(
          (iter) => datos_medio[ultimasIteraciones.indexOf(iter)]
        );
        nuevosDatosAlto = nuevaSeleccionadas.map(
          (iter) => datos_alto[ultimasIteraciones.indexOf(iter)]
        );
        nuevosDatosCritico = nuevaSeleccionadas.map(
          (iter) => datos_critico[ultimasIteraciones.indexOf(iter)]
        );
      }

      setDatosBajos(nuevosDatosBajos);
      setDatosMedio(nuevosDatosMedio);
      setDatosAlto(nuevosDatosAlto);
      setDatosCritico(nuevosDatosCritico);

      return nuevaSeleccionadas;
    });
  };

  const descargarGraficoEvolucion = () => {
    const url = grafico_evolucion.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = `grafico_evolucion_${proyecto.nombre}.png`;
    link.click();
  };

  const descargarGraficoTelaraña = () => {
    const url = grafico_resumen.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = `grafico_telaraña_${proyecto.nombre}.png`;
    link.click();
  };

  const descargarMatrizTongji = () => {
    const url = grafico_matriz.current.getScatterRef().toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = `grafico_matriz_tongji_${proyecto.nombre}.png`;
    link.click();
  };

  const { usuario } = useUsuario();
  const comprobacionEspectador =
    usuario.nombre_perfil === "Espectador" || usuario.nombre_perfil === "Administrador";

  return (
    <>
      <NavegadorLider />
      {comprobacionEspectador ? (
        <Alert variant="primary" className="text-center">
          Usted es espectador del proyecto {proyecto.nombre}. Sólo se permite la
          visualización.
        </Alert>
      ) : null}
      {iteracion === null ? (
        <Alert variant="danger" className="text-center">
          No existe una iteración activa del proyecto. Sólo se permite
          visualizar.
        </Alert>
      ) : null}
      <>
        <Container className="!mx-0 !max-w-none mt-2 flex flex-col justify-around">
          <Row
            className="flex"
            style={{ height: "50vh", gap: "2em", flexWrap: "nowrap", width: "100%" }}
          >
            <Col xs={9}>
              <Card style={{ maxHeight: "50vh" }}>
                  <Card.Header className="flex justify-between items-center">
                    <CardTitle>Evolución de cantidad de riesgo</CardTitle>
                  <div className="flex items-center gap-2">
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {"Seleccionar iteración"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{ maxHeight: "50vh", overflowY: "auto" }}
                      >
                        <Form.Check
                          type="checkbox"
                          id={`checkbox-all`}
                          label={"Todas las iteraciones"}
                          checked={iteracionesSeleccionadas.every(
                            (valor, i) => valor === ultimasIteraciones[i]
                          )}
                          onChange={() => {
                            setIteracionesSeleccionadas(ultimasIteraciones);
                            setDatosBajos(datos_bajo);
                            setDatosMedio(datos_medio);
                            setDatosAlto(datos_alto);
                            setDatosCritico(datos_critico);
                          }}
                          className="mx-3"
                        />
                        {ultimasIteraciones.map((item, index) => (
                          <Form.Check
                            key={index}
                            type="checkbox"
                            id={`checkbox-${index}`}
                            label={item}
                            checked={iteracionesSeleccionadas.includes(item)}
                            onChange={() => toggleIteracion(item)}
                            className="mx-3"
                          ></Form.Check>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {!comprobacionEspectador && (
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="descargar"
                        onClick={descargarGraficoEvolucion}
                      />
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  <div style={{ overflowX: "auto" }}>
                    <div
                      style={{
                        width: `${iteracionesSeleccionadas.length * 100}px`,
                        minWidth: "100%",
                      }}
                    >
                      <Bar
                        ref={grafico_evolucion}
                        data={{
                          labels: iteracionesSeleccionadas.map((label) =>
                            label.length > 10 ? label.match(/.{1,10}/g) : label
                          ),
                          datasets: [
                            {
                              label: "Irrelevantes",
                              data: datosBajos,
                              backgroundColor: "#2ecc71",
                            },
                            {
                              label: "Necesitan reevaluación",
                              data: datosMedio,
                              backgroundColor: "#f1c40f",
                            },
                            {
                              label: "Necesitan planificación",
                              data: datosAlto,
                              backgroundColor: "#f39c12",
                            },
                            {
                              label: "Críticos",
                              data: datosCritico,
                              backgroundColor: "#e74c3c",
                            },
                          ],
                        }}
                        options={{
                          barThickness: 20,
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              reverse: true,
                            },
                            tooltip: {
                              callbacks: {
                                title: function (tooltipItems) {
                                  const originalLabel = tooltipItems[0].label;
                                  // Eliminamos comas, espacios dobles, etc. para que se vea limpio
                                  const limpio = originalLabel.replace(
                                    /,/g,
                                    ""
                                  );
                                  return limpio;
                                },
                              },
                            },
                          },
                          scales: {
                            x: {
                              stacked: true,
                              title: {
                                display: true,
                                text: "Iteraciones",
                              },
                              ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0,
                              },
                            },
                            y: {
                              stacked: true,
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: "Cantidad de riesgos",
                              },
                            },
                          },
                        }}
                        height={220}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={5} style={{ width: "30vw" }}>
              <Card style={{ maxHeight: "55vh" }}>
                  <Card.Header className="flex justify-between items-center">
                    <CardTitle>Resúmen de riesgos</CardTitle>
                  {!comprobacionEspectador && (
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="descargar"
                      onClick={descargarGraficoTelaraña}
                    />
                  )}
                </Card.Header>
                <Card.Body>
                  <Radar
                    ref={grafico_resumen}
                    data={{
                      labels: categoriasProyecto,
                      datasets: [
                        {
                          data: datosTelarañaFormateados,
                          backgroundColor: "#2A6EBB",
                          fill: true,
                          borderColor: "#2A6EBB",
                          pointBackgroundColor: "#2A6EBB",
                        },
                      ],
                    }}
                    options={{
                      responsive: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      scales: {
                        r: {
                          min: 0,
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                    height={250}
                    width={400}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom:"20px"
              }}
            >
              <h2
                className="text-center text-xl"
                style={{ textDecoration: "underline" }}
              >
                Sobre el proyecto
              </h2>
            </Col>
            <Col xs={3}></Col>
          </Row>
          <Row
            className="flex"
            style={{ flexWrap: "nowrap", width: "100%" }}
          >
            <Col xs={9}>
              <Row className="mb-3">
                <Col xs={3}>
                  <Card>
                    <Card.Header
                      className="flex justify-center items-center"
                      style={{ minHeight: 65 }}
                    >
                      <CardTitle className="mb-0 text-center">Riesgos activos</CardTitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="text-center text-4xl">
                        {datos_proyecto?.riesgos_activos ?? 0}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={3}>
                  <Card>
                    <Card.Header
                      className="flex justify-center items-center"
                    style={{ minHeight: 65, textAlign: "center" }}>
                      <CardTitle className="mb-0 text-center">Evaluaciones pendientes</CardTitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="text-center text-4xl">
                        {datos_proyecto?.evaluaciones_pendientes ?? 0}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={3}>
                  <Card>
                    <Card.Header
                      className="flex justify-center items-center"
                      style={{ minHeight: 65 }}
                    >
                      <CardTitle className="mb-0 text-center">Planes de acción</CardTitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="text-center text-4xl">
                        {datos_proyecto?.planes_accion ?? 0}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header
                      className="flex justify-center items-center"
                      style={{ minHeight: 65 }}
                    >
                      <CardTitle className="mb-0 text-center">Requiere atención</CardTitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="text-center text-4xl">
                        {datos_proyecto?.riesgos_atencion ?? 0}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={5} style={{ width: "40%" }}>
              <Card style={{ maxHeight: "65vh" }}>
                <Card.Header className="flex justify-between items-center">
                  <CardTitle>Matriz tongji</CardTitle>
                  {!comprobacionEspectador && (
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="descargar"
                      onClick={descargarMatrizTongji}
                    />
                  )}
                </Card.Header>
                <Card.Body>
                  <MantrizTonji puntos={puntos} ref={grafico_matriz} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
      <Footer />
    </>
  );
}
