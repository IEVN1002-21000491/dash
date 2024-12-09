import { Pipe, PipeTransform } from "@angular/core";
import { Clientes } from "./clientes";
@Pipe({
    name: 'clienteFilter',
    standalone: true
})
export class ClienteFilterPipe implements PipeTransform {
    transform(value: Clientes[], args: string): Clientes[] {
        let filter:string=args ?args.toLocaleLowerCase():'';
     
        return filter? value.filter((cliente:Clientes)=>
        cliente.nombre.toLocaleLowerCase().indexOf(filter)!=-1
        ):value;
      }
}