export interface CategoriaProductoResponse {
  mensaje: string;
  object:  CategoriaProducto[];
}

export interface CategoriaProducto {
  id:     string | number;
  nombre: string;
}
