import React, { Component } from 'react'
import Visita from './visitaList.js'
import ModalContainer from '../../widgets/container/modal-container.js'
import swal from 'sweetalert';
import { firebaseApp } from '../../index.js'
import ModalHistoricoConversacion from '../../widgets/components/historicoConversacion.js'
import ModalVisita from '../../widgets/components/modalVisita.js'
import ModalAscensor from '../../widgets/components/modalAscensor.js'
import './modal.css'

class ListarVisitaCompleta extends Component {
  constructor() {
    super()
    this.rootRef = firebaseApp.database().ref('usuarios')
    this.user = firebaseApp.auth().currentUser
  }
  state = {
    modalVisible: false,
    vistitaPulsada: 0,
    numeroAscensor: 0,
    listaCompleta: [],
    idTodasVisitas: [],
    cssEdicion: 'inputOculto',
    textoNuevaVisita: '',
    proxNuevaVisita: '',
    proxVisita: '',
    textoInfoVisita: '',
    historico: false,
    modalVisita: true,
    modalAscensor: false,
  }

  handleClickSiguienteAscensor = () => {
    const length = this.state.listaCompleta[this.state.vistitaPulsada].ascensor.length
    const cantidadAscensoresActual = this.state.numeroAscensor
    if (cantidadAscensoresActual < length - 1) {
      this.setState((state) => {
        return { numeroAscensor: state.numeroAscensor + 1 }
      })
    }
  }

  handleChangeAnteriorAscensor = () => {
    if (this.state.numeroAscensor > 0) {
      this.setState((state) => {
        return { numeroAscensor: state.numeroAscensor - 1 }
      })
    }
  }

  handleVerClickVerListaCompleta = (event) => {
    const numeroVisitaPulsada = event.target.id
    const { listaCompleta } = this.state
    const visitaSeleccionada = listaCompleta[numeroVisitaPulsada]
    const fecha = visitaSeleccionada.conversacion[0].proxVisita
    const accionUltima = visitaSeleccionada.conversacion[0].textoInfoVisita
    this.setState({
      modalVisible: true,
      vistitaPulsada: numeroVisitaPulsada,
      proxVisita: fecha,
      textoInfoVisita: accionUltima
    })

  }

  handleCerrarModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  handleBorrarVisita = () => {
    // const ref = firebaseApp.database().ref('usuarios')
    const user = firebaseApp.auth().currentUser;
    swal({
      title: "¿Estas seguro que quieres borrar la visita?",
      text: "Si pulsas la visita se eliminará para siempre",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((borrado) => {
        if (borrado) {
          const borrarVisita = this.state.idTodasVisitas[this.state.vistitaPulsada]
          this.ref.child(user.uid).child('visita').child(borrarVisita).remove()
          let despuesBorrado = []
          this.ref.child(user.uid).child('visita').on('child_added', (snap) => {
            despuesBorrado.push(snap.val())
          })
          this.setState({
            listaCompleta: despuesBorrado,
            modalVisible: false
          })
          swal("La visita ha sido Borrada", {
            icon: "success",
          });
        } else {
          swal('¡¡Aun sigues teniendo la visita!!')
        }
      });
  }

  componentDidMount = () => {

    const listaBaseDatos = []
    const idVisitas = []

    this.rootRef.child(this.user.uid).child('visita').on('value', (snap) => {
      listaBaseDatos.push(snap.val())
      idVisitas.push(snap.key)
    })

    this.setState({
      listaCompleta: listaBaseDatos,
      idTodasVisitas: idVisitas,
    })
  }

  handleChange = (event) => {
    const target = event.target
    const value = target.value
    const id = target.id
    this.setState({
      [id]: value
    })
  }

  handleModificarVisita = () => {
    this.setState({
      cssEdicion: 'verInput',
    })
  }

  handleGuardarModificacion = () => {
    this.setState({
      cssEdicion: 'inputOculto'
    })

    swal("La visita ha sido Modificada")
  }

  handleNuevaConversacion = () => {
    const ref = firebaseApp.database().ref('usuarios')
    const user = firebaseApp.auth().currentUser;
    const visitaAModificar = this.state.idTodasVisitas[this.state.vistitaPulsada]
    const listaTotalActual = this.state.listaCompleta[this.state.vistitaPulsada].conversacion
    const longitudConversacion = listaTotalActual.length
    if (longitudConversacion === 1) {
      let subirConversacion = 1
      const nuevaConversacion = {
        [subirConversacion]: {
          textoInfoVista: this.state.textoNuevaVisita,
          proxVisita: this.state.proxNuevaVisita,
        }
      }
      ref.child(user.uid).child('visita').child(visitaAModificar).child('conversacion').update(nuevaConversacion)
    }
    else {
      let subirConversacion = longitudConversacion
      console.log(subirConversacion);
      const nuevaConversacion = {
        [subirConversacion]: {
          textoInfoVista: this.state.textoNuevaVisita,
          proxVisita: this.state.proxNuevaVisita,
        }
      }
      ref.child(user.uid).child('visita').child(visitaAModificar).child('conversacion').update(nuevaConversacion)
    }

    swal('Se ha añadido nueva Accion')

  }


  historicoConversacion = () => {
    this.setState({
      historico: true
    })
  }

  handleVerLosAscensores = () => {
    this.setState({
      modalAscensor: true,
      modalVisita: false,
    })
  }

  handleVolverInformacion = () => {
    this.setState({
      modalAscensor: false,
    })
  }

  handleClickVolverModal = () => {
    this.setState({
      historico: false,
    })
  }

  render() {

    const {
      listaCompleta,
      pulsada
    } = this.state

    const listaActual = listaCompleta[pulsada] || []
    const ObjetoConversacion = listaActual.conversacion || []
    const arrayConversacion = [];
    for (var objeto in ObjetoConversacion) {
      arrayConversacion.push(ObjetoConversacion[objeto]);
    }
    if (this.state.modalVisible) {
      return (
        <ModalContainer>
          <div className="Modal">
            <div className="container">
              <h1 className="tituloPrincipal">Descripcion de la visita Realizada</h1>
              {
                this.state.modalAscensor ?
                  <ModalAscensor
                    handleVolverInformacion={this.handleVolverInformacion}
                    rae={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].rae}
                    paradas={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].paradas}
                    anchoHueco={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].anchoHueco}
                    fondoHueco={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].fondoHueco}
                    personas={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].personas}
                    puertasCabina={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].puertasCabina}
                    puertasPiso={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].puertasPiso}
                    maquina={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].maquina}
                    embarques={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].embarques}
                    observacionAscensor={this.state.listaCompleta[this.state.vistitaPulsada].ascensor[this.state.numeroAscensor].observacionAscensor}
                    handleClickSiguienteAscensor={this.handleClickSiguienteAscensor}
                    handleChangeAnteriorAscensor={this.handleChangeAnteriorAscensor}
                    cssEdicion={this.state.cssEdicion}
                    handleChange={this.handleChange}
                    handleGuardarModificacion={this.handleGuardarModificacion}
                  />
                  :
                  this.state.historico ?
                    <ModalHistoricoConversacion
                      handleClickVolverModal={this.handleClickVolverModal}
                      arrayConversacion={arrayConversacion}
                    />
                    :
                    <ModalVisita
                      historicoConversacion={this.historicoConversacion}
                      handleVerLosAscensores={this.handleVerLosAscensores}
                      handleCerrarModal={this.handleCerrarModal}
                      tipoPresupuesto={this.state.listaCompleta[this.state.vistitaPulsada].tipoPresupuesto}
                      poblacion={this.state.listaCompleta[this.state.vistitaPulsada].poblacion}
                      codigoPostal={this.state.listaCompleta[this.state.vistitaPulsada].postal}
                      direccion={this.state.listaCompleta[this.state.vistitaPulsada].calle}
                      nombrePresidente={this.state.listaCompleta[this.state.vistitaPulsada].nombrePresidente}
                      telefonoPresidente={this.state.listaCompleta[this.state.vistitaPulsada].telefonoPresidente}
                      correElectronico={this.state.listaCompleta[this.state.vistitaPulsada].emailPresidente}
                      horaVisita={this.state.listaCompleta[this.state.vistitaPulsada].horaVisita}
                      administrador={this.state.listaCompleta[this.state.vistitaPulsada].nombreAdministrador}
                      marcaAscensor={this.state.listaCompleta[this.state.vistitaPulsada].marca}
                      mantenedor={this.state.listaCompleta[this.state.vistitaPulsada].mantenedor}
                      conversacion={this.state.proxVisita}
                      fechaConversacion={this.state.textoInfoVisita}
                      numeroAscensores={this.state.listaCompleta[this.state.vistitaPulsada].numeroAscensores}
                      handleChange={this.handleChange}
                      handleModificarVisita={this.handleModificarVisita}
                      cssEdicion={this.state.cssEdicion}
                      handleGuardarModificacion={this.handleGuardarModificacion}
                      handleNuevaConversacion={this.handleNuevaConversacion}
                    />
              }
              <div>
                <button type="button" onClick={this.handleBorrarVisita} className="btn btn-danger botonBorrar">Borrar Visita</button>
              </div>
              <div>
                <button type="button " className="Modal-close" onClick={this.handleCerrarModal} ></button>
              </div>
            </div>
          </div>
        </ModalContainer>
      )
    }
    return (

      listaCompleta.map((key, i) => {
        let contador = i + 1
        return (
          Object.keys(key).map((item) => {           
            return (
              <Visita
                direccion={key[item].calle}
                poblacion={key[item].poblacion}
                mantenedor={key[item].mantenedor}
                codigoPostal={key[item].postal}
                tipoPresupuesto={key[item].tipoPresupuesto}
                importancia={key[item].interes}
                administrador={key[item].nombreAdministrador}
                proxVisita={'probando'}
                key={i}
                contador={contador}
                handleVerClick={this.handleVerClickVerListaCompleta}
                numeroDeVisita={i}
              />
            )
          })
        );
      })
    )
  }
}


export default ListarVisitaCompleta
