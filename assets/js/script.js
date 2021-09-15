$(document).ready(function(){
  //Se crean 3 variables y se les asigna mediante selectores, los elementos correspondientes a su id.
  let contenedor = $('#caja2');
  let error_modal = $('#modal-error');
  let error_modal2 = $('#modal-error2');

  //Se establece un evento al presionar el botón buscar
  $('#buscar').on('click', function(event){
    event.preventDefault();

    //Se declara un arreglo vacío, para que cada que vez que se presione el botón este comience vacío;
    let estadisticas = [];

    //se crea una variable y se le asigna el valor del input buscador.
    let id_heroe = $('#buscador').val();

    //se crea una variable que guarda la ruta de la API más el id del superheroe a buscar
    let url_completa = "https://www.superheroapi.com/api.php/4603744052978428/"+id_heroe ;


    if(validar(id_heroe) == false){
      error_modal.show(100);
      contenedor.hide();
      return 0;
    }

    $.ajax({
        type: "GET",
        url: url_completa,
        dataType: "json",
        success: function(data){

          // si el id que se ingresó no está registrado o es inválido, se muestra el error en pantalla
            if(data.error == 'invalid id'){
              contenedor.hide();
              error_modal.hide();
              error_modal2.show();
              return;
            } else {
              error_modal.hide();
              error_modal2.hide();
            }

            // A cada elemento del documento se le pasa y asigna el valor que se encontró de la API
            let nombre = data.name;
            $('#imagen').attr("src",data.image.url);
            $('#nombre').text("Nombre: "+data.name);
            $('#conexiones').text("Conexiones: "+data.connections["group-affiliation"]);
            $('#publicador').text("Publicado por: "+data.biography.publisher);
            $('#ocupacion').text("Ocupación: "+data.work.occupation);
            $('#aparicion').text("Primera Aparición: "+data.biography["first-appearance"]);
            $('#altura').text("Altura: "+data.appearance.height);
            $('#peso').text("Peso: "+data.appearance.weight);
            $('#alias').text("Alias: "+data.biography.aliases);

            crear_grafico(data);
            contenedor.show(1000);
        },
        error: function(){
          error_modal2.show();
        }
      });


      //Función que crea el gráfico
      function crear_grafico(data){
        let datosApi = data.powerstats;

        //Se crea un array a partir del objeto que se recibe de la API y luego se recorre para llenar el arreglo de estadísticas con sus valores
        let arreglo = Object.keys(datosApi).map((key) => [key, datosApi[key]]);
        for (let dato of arreglo) {
          //Si el primer elemento del arreglo posee un null, entonces se establece el gráfico sin información
          if(dato[1] == 'null'){
            estadisticas.push({y: 100, label: 'Sin información'});
            break;
          }
          estadisticas.push({y: dato[1], label: dato[0]});
        }

        //se configuran opciones del grafico de torta que se va a mostrar a partir de los powerstats del superheroe
        let config = {
          animationEnabled: true,
          title: {
            text: "Estadísticas de poder para " + data.name
          },
          data: [{
            type: "pie",
            showInLegend: "true",
            legendText: "{label}",
            indexLabel: "{label} ({y})",
            dataPoints: estadisticas
          }]
        }
        //Se pinta el gráfico en el elemento del documento
        $("#chartContainer").CanvasJSChart(config);
      }

      //Función que recibe un id y valida que este sea un número, devuelve un boolean
      function validar(id_heroe){
          let patron = /^-?(0|[1-9]\d*)?$/;
          let valido = true;

          if(!patron.test(id_heroe)){
            valido = false;
          }
          return valido;
      }

  });
});
