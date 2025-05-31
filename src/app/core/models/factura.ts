import { DecimalPipe } from "@angular/common";

export class NubeFactura {
    IdFactura?: number;
    AutorizacionSri?: string;
    FechaAutorizacion?: string;
    Idcompania?:number;
    DireccionMatriz?: string;
    Ambiente?:number;
    TipoEmision?:number;
    RazonSocial?: string;
    NombreComercial?: string;
    Propina?: number;
    Moneda?: string;
    Secuencial?: string;
    FechaEmision?: string;
    DireccionComprador?: string;
    DireccionEstablecimiento?: string;
    CorreoComprador?: string;
    RazonSocialComprador?: string;
    TipoIdentificacionComprador?: string;
    Establecimiento?: string;
    CodigoDocumento?: string;
    ObligadoContabilidad?: string;
    PuntoEmision?: string;
    IdentificacionComprador?: string;
    telefono?: string;
    Ruc?: string;
    ClaveAcceso?: string;
    IdCompania?: string;
    CodCliente?:number;
    ImporteTotal?:number;
    TotalSinImpuesto?:number;
    TotalDescuento?:number;
    NubeDetalleFactura?:NubeDetalleFactura[];
    NubeFacturaPago?:NubeFacturaPago[];
    NubeFacturaImpuesto?:NubeFacturaImpuesto[];
  }
  export class NubeDetalleFactura {
    IdDetalleFactur?: number;
    IdFactura?: number;
    Idproducto?: number;
    Descripcion?: string;
    Cantidad?: number;
    PrecioUnitario?: number;
    Descuento?: number;
    importeTotal?: number;
    Impuestos?: number;
    Idalmacen?: number;
    PrecioTotalSinImpuesto?: number;
    NubeDetalleFacturaImpuesto?:NubeDetalleFacturaImpuesto[];
  }
  
  export class NubeFacturaPago {
    IdPag?: number;
    FormaPago?: string;
    descripion?: string;
    Total?: number;
    Plazo?: number;
    UnidadTiempo?: string;
  
  }
  export class NubeDetalleFacturaImpuesto {
    IdDetalleFacturaImpuesto?: number;
    Codigo?: number;
    CodigoPorcentaje?: number;
    BaseImponible?: number;
    Tarifa?: number;
    Valor?: number;
  }
  export class NubeFacturaImpuesto {
    IdDetalleFacturaImpuesto?: number;
    Codigo?: number;
    CodigoPorcentaje?: number;
    BaseImponible?: number;
    Tarifa?: number;
    Valor?: number;
  }


  export class NubeFormaPago{
    IdFormaPago?: number;
    Codigo?: string;
    Descripcion?: string;
  } 