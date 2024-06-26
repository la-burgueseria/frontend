import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmpleadosService} from "../../services/empleados.service";
import {MesasService} from "../../services/mesas.service";
import {Empleado} from "../../interfaces/empleado";
import {Mesa, Producto} from "../../interfaces";
import {ModalAddProductoComponent} from "../modal-add-producto/modal-add-producto.component";
import {ProductoCuenta} from "../../interfaces/productosCuenta";
import {LocalService} from "../sharedMethods/localStorage/local.service";


interface ProductoDeCuenta {
  cantidad: number;
  obj:      Obj;
}

interface Obj {
  categoriaProducto: CategoriaProducto;
  descripcion:       string;
  id:                number;
  imagen:            string;
  nombre:            string;
  precio:            number;
}

interface CategoriaProducto {
  id:     number;
  nombre: string;
}

@Component({
  selector: 'app-modal-cuentas',
  templateUrl: './modal-cuentas.component.html',
  styleUrls: ['./modal-cuentas.component.css']
})
export class ModalCuentasComponent implements OnInit{


  form: FormGroup;
  empleados : Empleado[] = [];
  mesas : Mesa[] = [];
  //filtrar mesas disponibles y empleados activos
  empleadosActivos : Empleado[] = [];
  mesasDisponibles : Mesa[] = [];
  //productos seleccionados
  productosCuenta : ProductoCuenta[] = [];
  //total de la cuenta
  totalCuenta = 0;
  //mesa y empleado seleccionado
  empleadoSeleccionado : Empleado | undefined;
  mesaSeleccionada : Mesa | undefined;
  rolEmpleado = this.localStorageService.getUserRole();


  constructor(
    public dialogRef: MatDialogRef<ModalCuentasComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private fb : FormBuilder,
    private empleadoService : EmpleadosService,
    private mesaService : MesasService,
    public dialog : MatDialog,
    private localStorageService : LocalService,
  ) {
    this.form = this.fb.group({
      empleado : [null, Validators.required],
      mesa : [null, Validators.required],
    })
  }

  async ngOnInit(): Promise<void> {
    this.getEmpleados();
    this.getMesas();
    if (this.rolEmpleado === 'MESERO') {
      const id: number = parseInt(sessionStorage.getItem("empleadoId")!);
      this.empleadoSeleccionado = await this.getEmpleadoByID(id);
      this.form.get('empleado')?.setValue(this.empleadoSeleccionado);
    }
  }

  /*
  *
  * METODOS
  * */
  async getEmpleadoByID(id: number): Promise<Empleado> {
    let request = await this.empleadoService.getEmpleadoById(id).toPromise();
    const empleado: Empleado = request.object;
    return empleado;
  }

  onEmpleadoSeleccionado(event: { value: any; }): void {
    const empleadoId = event.value;
    this.empleadoSeleccionado = this.empleados.find(empleado => empleado.id === empleadoId.id);
  }

  onMesaSeleccionada(event: any): void {
    const mesaSelect = event.source.value;
    this.mesaSeleccionada = this.mesasDisponibles.find(mesa => mesa.id === mesaSelect.id);
  }

  quitarProducto(producto: Producto): void {
    this.productosCuenta = this.productosCuenta.filter(p => p.producto.id !== producto.id);
    this.calcularTotal();
  }


  private calcularTotal(){
    let total = 0;
    this.productosCuenta.forEach(producto => {
      total += producto.cantidad * producto.valorProducto
    });
    this.totalCuenta = total;
  }

  public formatearNumeroConPuntos(numero: number): string {
    // Usa la función toLocaleString para formatear el número con separadores de miles
    return numero.toLocaleString();
  }
  /*
  * PETICIONES HTTP
  *
  * */

  private getEmpleados(){
    this.empleadoService.getEmpleados()
      .subscribe(
        data =>{
          this.empleados = data.object
          //filtrar por empleado activo
          this.empleados.forEach( empleado => {
            if (empleado.estado) {
              this.empleadosActivos.push(empleado)
            }
          })
        },
        error =>{
          console.log(error)
        }
      )
  }
  private getMesas(){
    this.mesaService.getMesas()
      .subscribe(
        data =>{
          this.mesas = data.object;
          //obtener mesas habilitadas
          this.mesas.forEach(mesa =>{
            if(mesa.estado != "Deshabilitada"){
              this.mesasDisponibles.push(mesa);
            }
          })
        },
        error =>{
          console.log(error)
        }
      )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {

      const datosAEnviar = {
        productos : this.productosCuenta,
        total : this.totalCuenta,
        empleado : this.empleadoSeleccionado,
        mesa : this.mesaSeleccionada
      }

      this.dialogRef.close(datosAEnviar);
    }else{
      console.log("formulario invalido")
    }
  }

  /*
  *
  * MODALES
  * */
  modalAgregarProducto(){
    const dialogRef = this.dialog.open(ModalAddProductoComponent, {
      width: '400px', // Ajusta el ancho según tus necesidades
      position: { right: '0' }, // Posiciona el modal a la derecha
      height: '350px',
    });
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result){
          const productoCuenta : ProductoCuenta = {
            id: 0,
            producto: result.producto,
            cantidad: result.cantidad,
            valorProducto: result.producto.precio,
            estado: "Por despachar",
            cuenta: null
          }

          this.productosCuenta.push(productoCuenta);

          this.calcularTotal();
        }
      }
    )
  }
}
