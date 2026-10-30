import React from "react";
import { Container, Card } from "react-bootstrap";

/**
 * Componente Contenedor
 *
 * Este componente renderiza un contenedor general para estructurar las vistas de la aplicación.
 * Divide el contenido en tres secciones: encabezado, cuerpo y pie de página (opcional).
 *
 * @param {ReactNode[]} children - Un array de elementos React que representan el contenido del encabezado, cuerpo y pie de página.
 * @returns {JSX.Element} - Un contenedor con secciones de encabezado, cuerpo y pie de página (si está presente).
 */

export default function Contenedor({ children }) {
  // Desestructuración del contenido: headerContent, bodyContent, footerContent
  const [headerContent, bodyContent, footerContent] = children;

  return (
    <Container className="pt-4 pb-5" style={{ minHeight: "75vh" }}>
      <Card>
        <Card.Header>{headerContent}</Card.Header>
        <Card.Body>{bodyContent}</Card.Body>
        {footerContent && <Card.Footer>{footerContent}</Card.Footer>}
      </Card>
    </Container>
  );
}
