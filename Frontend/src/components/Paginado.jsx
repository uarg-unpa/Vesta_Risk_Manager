import React from 'react'
import { Pagination } from 'react-bootstrap'

export default function Paginado({paginaActual, setPaginaActual, totalPaginas}) {
  return (
    <>
      {totalPaginas > 0 ? (
        <Pagination>
          <Pagination.First disabled={paginaActual == 1} onClick={()=>{
            setPaginaActual(1)
            localStorage.setItem("pagina_riesgo", 1)
          }}/>
          <Pagination.Prev disabled={paginaActual == 1} onClick={()=>{
            setPaginaActual(paginaActual-1)
            localStorage.setItem("pagina_riesgo", paginaActual-1)
          }}/>
          {[...Array(totalPaginas)].map((_, index) => (
            <Pagination.Item 
              key={index + 1} 
              active={index + 1 == paginaActual}
              onClick={() => {
                setPaginaActual(index + 1)
                localStorage.setItem("pagina_riesgo", index + 1)
              }}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={paginaActual == totalPaginas} onClick={()=>{
            setPaginaActual(paginaActual +1)
            localStorage.setItem("pagina_riesgo", paginaActual + 1)
          }} />
          <Pagination.Last disabled={paginaActual == totalPaginas} onClick={()=>{
            setPaginaActual(totalPaginas)
            localStorage.setItem("pagina_riesgo", totalPaginas)
          }}/> 
        </Pagination>
      ) : null}
    </>
  )
}
    