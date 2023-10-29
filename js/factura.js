let productos = [];
const url = "api/productos.json";

// Variante de función getJSONData. Estaban utilizando fetch en crudo, por eso
//animé a reutilizar código.
let obtener = (url) => {
  var resultado = {};
  return fetch(url)
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else {
        throw Error(respuesta.statusText);
      }
    })
    .then((respuesta) => {
      resultado.status = "ok";
      resultado.data = respuesta;

      return resultado;
    })
    .catch((error) => {
      resultado.status = "error";
      resultado.data = error;

      return resultado;
    });
};
//Función que carga los productos a la lista desplegable
function cargarProductos(listaProductos) {
  let producto = document.getElementById("producto");
  for (let elemento of listaProductos) {
    producto.innerHTML += `<option value= ${elemento.producto} -  ${elemento.precio}>${elemento.producto} -  ${elemento.precio} </option>`;
  }
}
function recalcular() {
  let cantidades = document.getElementsByClassName("cant");
  let precios = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  var total = 0;
  console.log("Total es: " + typeof total);
  for (let i = 0; i < precios.length; i++) {
    total += parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    );

    resultados[i].innerHTML = parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    ).toFixed(2);
    console.log("Peero el programa dice que total ahora es: " + typeof total);
  }
  console.log("Total ahora es:" + typeof total);
  document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}
function agregarALista() {
  let cant = parseInt(document.getElementById("cantidad").value);
  let lista = document.getElementById("lista"); //tomo el tbody
  let index = document.getElementById("producto").selectedIndex; //tomo el índice
  //del producto seleccionado.

  lista.innerHTML += `<tr><td class="productoN">${
    productos[index].producto
  } </td><td>$ <span class="precio">${
    productos[index].precio
  }</span></td><td><input type="number" class="form-control cant" value="${cant}" onchange="recalcular();" ></td><td>$ <span class="res">${(
    cant * productos[index].precio
  ).toFixed(
    2
  )}</span></td><td><img src="/img/borrar.png" width="20"><span></td></tr>`;
  recalcular();
}


function getCurrentDateTime() {
  const date = new Date().toLocaleDateString();
  return date.toLocaleString();
}

function imprimirTicket() {
  let doc = new jsPDF();

  let productos = document.getElementsByClassName("productoN");
  let cantidades = document.getElementsByClassName("cant");
  let precio = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  let total = document.getElementById("total");
  let cliente = document.getElementById("cliente");
  let rut = document.getElementById("rut");

  console.log(productos[0].innerText);

  doc.setFontSize(30);
  doc.text(70, 20, 'Ferretería "267"');
  doc.setFontSize(15);
  doc.text(20, 40, 'Factura: 123-123-123');
  doc.text(145, 40, 'Fecha: '+ getCurrentDateTime());
  doc.text(20, 50, 'Cliente: ' + cliente.value);
  doc.text(145, 50, 'Rut: ' + rut.value);
  doc.setFontSize(20);
  doc.line(10, 65, 200, 65,);
  doc.text(20, 80, 'Articulo');
  doc.text(65, 80, 'Cant.');
  doc.text(120, 80, 'Precio');
  doc.text(160, 80, 'Total');

  doc.line(10, 85, 200, 85,);

  doc.setFontSize(16);

  let yPos = 100;

  for (let i=0; i<productos.length ; i++) {
    let producto = productos[i].innerText.slice(0, 10) + '...' ;;
    let pre = precio[i].innerText;
    let cant = cantidades[i].value;
    let res = resultados[i].innerText;

    doc.text(20 ,yPos, producto);
    doc.text(120, yPos, pre);
    doc.text(70, yPos, cant);
    doc.text(160, yPos, res);
    doc.line(10, yPos + 5, 200, yPos + 5);

    yPos += 20;
  }
  doc.setFontSize(20);
  doc.text(145, yPos + 20, `Total:` + total.innerText);
  doc.save(cliente + ".pdf");
}



document.addEventListener("DOMContentLoaded", () => {
  obtener(url).then((resultado) => {
    //Agrego los productos a la lista
    if (resultado.status === "ok") {
      console.log(resultado.data);
      productos = resultado.data;
      cargarProductos(productos);
      console.log(productos);
    }
  });
  let btnAgregar = document.getElementById("agregar");
  btnAgregar.addEventListener("click", () => {
    agregarALista();
  });

  // validacion de formulario

  let btnImprimir = document.getElementById("imp");
  let rut = document.getElementById("rut");
  let cliente = document.getElementById("cliente");
  let cantidad= document.getElementById("cantidad");
  let alerta = document.getElementById("completarCampos");

  btnImprimir.addEventListener("click", () => {
    if(cliente.value.trim() === "" && rut.value.trim() === "" && cantidad.value.trim() === ""){
      cliente.classList.add("is-invalid");
      rut.classList.add("is-invalid");
      cantidad.classList.add("is-invalid");

    } else {
      cliente.classList.remove("is-invalid");
      rut.classList.remove("is-invalid");
      cantidad.classList.remove("is-invalid");
      imprimirTicket();
    }
  });
});
