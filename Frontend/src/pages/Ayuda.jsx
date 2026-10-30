import React from "react";
import NavegadorLider from "../components/NavegadorLider";
import Contenedor from "../components/Contenedor";
import DiagramaEscudo from "../assets/img/Diagrama_escudo.png";
import { Figure } from "react-bootstrap";
import Footer from "../components/Footer";

export default function Ayuda() {
  return (
    <>
      <NavegadorLider />
      <Contenedor>
        <h3>Ayuda del Sistema</h3>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Figure.Image src={DiagramaEscudo} width={450} />
          <section>
            <h4>Diagrama de Flujo: Estado de los Riesgos</h4>
            <h5>Descripción del proceso</h5>
            <p>
              Este diagrama representa el flujo de trabajo para gestionar
              riesgos de un proyecto, desde su incorporación hasta la toma de
              decisiones basada en su {" "} 
              <strong>Factor de Riesgo - FR</strong>.
            </p>

            <h5>Pasos del flujo</h5>
            <ol>
              <li>
                <strong>Agregar riesgo a la lista:</strong> el proceso comienza
                cuando se identifica y se agrega un nuevo riesgo al sistema.
              </li>
              <li>
                <strong>Evaluar riesgo:</strong> una vez agregado, se procede a
                evaluar el riesgo en base a su probabilidad y su impacto en una escala del 1 al 10. El 1 representa poca probabilidad o poco impacto y el 10 representa alta probabilidad y alto impacto.
              </li>
              <li>
                <strong>¿Factor de riesgo? (FR):</strong> se calcula un valor
                numérico llamado <strong>FR (Factor de Riesgo)</strong>. Este es en base al producto de la probabilidad y el impacto de la evaluación realizada. En
                función de este valor, el sistema clasifica el riesgo en
                distintas categorías:
              </li>
            </ol>

            <h5>Clasificación del FR (Factor de Riesgo)</h5>
            <ul>
              <li>
                <strong>FR &lt; 9:</strong> Riesgo{" "}
                <em>muy bajo o insignificante</em>.<br />
                 - Representado por un escudo gris con una {'"X"'}.<br />
                 - No se toman acciones. Se cierra el ciclo.
              </li>
              <li>
                <strong>9 ≤ FR &lt; 36:</strong> Riesgo <em>bajo</em>.<br />
                - Escudo azul con flechas circulares.
                <br />
                 - Puede requerir monitoreo o reevaluación en el futuro.
              </li>
              <li>
                <strong>36 ≤ FR &lt; 64:</strong> Riesgo <em>moderado</em>.
                <br />
                - Escudo rojo con un signo de exclamación.
                <br />
                -   Se requiere generar un <strong>plan de acción</strong>.
              </li>
              <li>
                <strong>64 ≤ FR:</strong> Riesgo <em>alto o crítico</em>.<br />
                - Escudo rojo con doble exclamación.
                <br />
                - También requiere un <strong>plan de acción inmediato</strong>
                .
              </li>
            </ul>

            <h5>Generación de planes de acción</h5>
            <p>
              Para los riesgos moderados y críticos, se generan{" "}
              <strong>planes de acción</strong>. Una vez definidos:
            </p>
            <ul>
              <li>Se asocian a un ícono verde de verificación con escudo.</li>
              <li>
                Luego, el riesgo <strong>pasa a la siguiente iteración</strong>{" "}
                para volver a ser evaluado más adelante.
              </li>
            </ul>
            <hr />
          <p>
            Para más información, consultá el <strong>manual de usuario</strong>
            . Para verlo, presioná{" "}
            <a
              href="https://drive.google.com/file/d/1qPd9atlI1tzKmVD5garIBb6eUoAr6R73/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              aquí
            </a>
            .
          </p>
          </section>
        </div>
      </Contenedor>
      <Footer />
    </>
  );
}
