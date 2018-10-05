import React from 'react'

function  VisitaLista(props) {
    console.log(props,'props');
    
    return (
      <tr>
         <th scope="row">{props.contador}</th>
            <td>{props.data.calle}</td>
            <td>{props.data.poblacion}</td>
            <td>{props.data.postal}</td>
            <td>{props.data.mantenedor}</td>
            <td>{props.data.importancia}</td>
            <td>{props.data.administrador}</td>
            <td>{props.data.tipoPresupuesto}</td>
            <td>{props.proxVisita}</td>
            <td>
             <button id={props.numeroDeVisita} type="button" onClick={(e)=>props.handleVerClick(e,props.keyData)} className="btn btn-info mr-2">Ver</button>
             </td>
          </tr>
    )
}

export default VisitaLista
