import { Injectable } from '@angular/core';
import Swal, {SweetAlertResult} from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }


  //alerta confirmar eliminar

  //esta elerta retorna dos valores
  //.isConfirmed y .isDimissed
  //un ejemplo de uso donde se haga el import de estta funcion seria el siguiente:
  /*
  * this.alertaConfirmarEliminar()
      .then(
        (result) => {
          if(result.isConfirmed){
          * AGGREGAR ACCIONES PERSONALIZADAS (PUEDE SER OTRA ALERTA)
            console.log('Eliminando elemento....')
          }else if(result.dismiss === Swal.DismissReason.cancel ){
          * AGREGAR ACCIONES PERSONALIZADAS (PUEDE SER OTRA ALERTA)
            console.log("Se ha cancelado la eliminacion")
          }
        }
      );
  * */
  public alertaConfirmarEliminar() : Promise<SweetAlertResult>{
    // @ts-ignore
    return Swal.fire({
      title: "¿Estas seguro de eliminar este elemento?",
      icon:"warning",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText:"Cancelar",
      reverseButtons: true,
      background: '#1e1e1e', // Fondo oscuro
    }).then(
      // @ts-ignore
      (result) => {
        if(result.isConfirmed){
          return Swal.fire({
            title: "¡Esta acción es irreversible!",
            text: "Todas las entidades asociadas a esta tambien serán eliminadas",
            icon:"warning",
            color: "#d33",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro de eliminar.",
            cancelButtonText:"Cancelar",
            reverseButtons: true,
            background: '#1e1e1e', // Fondo oscuro
          })

        }else if(result.dismiss === Swal.DismissReason.cancel ){
          let timerInterval: any;
          // @ts-ignore
          return Swal.fire({
            title: "No se ha realizado ningún cambio en el elemento.",
            icon: 'error',
            timer: 2000,
            color: "#fff",
            timerProgressBar: true,
            position: 'center', // Esquina inferior derecha
            showConfirmButton: false, // Ocultar el botón de confirmación
            background: '#1e1e1e', // Fondo oscuro
            didOpen: () => {
              Swal.showLoading();
              // @ts-ignore
              const timer: any = Swal.getPopup().querySelector(".dark-mode-timer");
              timerInterval = setInterval(() => {
                // @ts-ignore
                const remainingSeconds = Swal.getTimerLeft() / 1000;

              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          });
        }
      }
    )
  }

  //alerta pera pedir confirmacion al editar
  public alertaPedirConfirmacionEditar() : Promise<SweetAlertResult>{
    // @ts-ignore
    return Swal.fire({
      title: "¿Estas seguro de editar este elemento?",
      icon:"warning",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, editar.",
      cancelButtonText:"Cancelar",
      reverseButtons: true,
      background: '#1e1e1e', // Fondo oscuro
    })
  }

  //alerta para informar que los insumos es menor a 0
  public alertaInsumosNegativos(insumosADeducir : any[]) : Promise<SweetAlertResult>{
    const listaHtml = insumosADeducir.map(
      (insumo) => {
        return `<li><b>${insumo.insumo.nombre}</b>: Existencias: ${insumo.insumo.cantidad},
                Cantidad a restar: ${insumo.cantidadARestar},
                Cantidad Resultante: ${insumo.resultadoResta}</li>`
      }
    ).join('');

    // @ts-ignore
    return Swal.fire({
      title: "¡Atención! no hay ingredientes suficientes para este pedido.",
      html: `<ul>${listaHtml}</ul>`,
      icon: "warning",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: '#1e1e1e', // Fondo oscuro
    });
  }


  public alertaConfirmarCreacion(){
    let timerInterval: any;
    // @ts-ignore
    Swal.fire({
      title: "Elemento guardado exitosamente!",
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      position: 'center', // Esquina inferior derecha
      showConfirmButton: false, // Ocultar el botón de confirmación
      background: '#1e1e1e', // Fondo oscuro
      didOpen: () => {
        Swal.showLoading();
        // @ts-ignore
        const timer: any = Swal.getPopup().querySelector(".dark-mode-timer");
        timerInterval = setInterval(() => {
          // @ts-ignore
          const remainingSeconds = Swal.getTimerLeft() / 1000;

        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      // Lógica adicional después de cerrar la alerta
    });
  }


  //alerta temporal confirmar eliminacion
  public alertaEliminadoCorrectamente(){
    let timerInterval: any;
    // @ts-ignore
    Swal.fire({
      title: "Se ha eliminado el elemento correctamente.",
      icon: 'success',
      timer: 2000,
      color: "#fff",
      timerProgressBar: true,
      position: 'center', // Esquina inferior derecha
      showConfirmButton: false, // Ocultar el botón de confirmación
      background: '#1e1e1e', // Fondo oscuro
      didOpen: () => {
        Swal.showLoading();
        // @ts-ignore
        const timer: any = Swal.getPopup().querySelector(".dark-mode-timer");
        timerInterval = setInterval(() => {
          // @ts-ignore
          const remainingSeconds = Swal.getTimerLeft() / 1000;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  }

  //alerta cuando no se realizó ninguna modificacion en el elemento
  public alertaSinModificaciones(){
    let timerInterval: any;
    // @ts-ignore
    Swal.fire({
      title: "No se ha realizado ningún cambio en el elemento.",
      icon: 'error',
      timer: 2000,
      color: "#fff",
      timerProgressBar: true,
      position: 'center', // Esquina inferior derecha
      showConfirmButton: false, // Ocultar el botón de confirmación
      background: '#1e1e1e', // Fondo oscuro
      didOpen: () => {
        Swal.showLoading();
        // @ts-ignore
        const timer: any = Swal.getPopup().querySelector(".dark-mode-timer");
        timerInterval = setInterval(() => {
          // @ts-ignore
          const remainingSeconds = Swal.getTimerLeft() / 1000;

        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  }
}