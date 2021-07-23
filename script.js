let opcion = 0
let vHelados = []
let vVentas = []
const menu = `Ingrese el número de la acción que desea ejecutar:\n
        1. Agregar producto al inventario
        2. Modificar producto en inventario
        3. Eliminar producto de inventario
        4. Mostrar inventario
        5. Realizar venta
        6. Registro de ventas
        7. Salir del sistema
`

while (true) {
    opcion = parseInt(prompt(menu))
    if (opcion === 1) {
        agregarHelado()
    } else if (opcion === 2) {
        modificarHelado()
    } else if (opcion === 3) {
        eliminarHelado()
    } else if (opcion === 4) {
        mostrarRegistro(vHelados, 'inventario')
    } else if (opcion === 5) {
        realizarVenta()
    } else if (opcion === 6) {
        mostrarRegistro(vVentas, 'registro de ventas', true)
    } else if (opcion === 7) {
        if (window.confirm('¿Está segur@ que desea salir?')) {
            break
        }
    } else {
        alert('Opción no reconocida')
    }
}

function Helado(nombre, sabor, cantidad, precio) {
    this.nombre = nombre
    this.sabor = sabor
    this.cantidad = cantidad
    this.precio = precio
    this.ventas = 0

    this.mostrarInfo = function(...params) {
        let info = ''
        let spaces = 0
        let nombreAtributos = Object.keys(this)
        for (let i = 0; i < params.length; i++) {
            if (i == 0) {spaces = 1} else {spaces = 4}
            if (nombreAtributos.includes(params[i])) {
                let nombreAtributo = nombreAtributos[nombreAtributos.indexOf(params[i])]
                info += ' '.repeat(spaces) +`${nombreAtributo.charAt(0).toUpperCase() + nombreAtributo.slice(1)}: ${this[params[i]]}\n`
            }
        }
        return info
    }
}

function nombreHelados(array) {
    let nombreHelados = []
    array.forEach(helado => {
        nombreHelados.push(helado.nombre)
    })
    return nombreHelados
}

function comprobarRegistro(array, str) {
    if (array.length === 0) {
        alert(str)
        return true
    } else {
        return false
    }
}

function comprobarOpcion(info, array) {
    let opcion = parseInt(prompt(info))
    while (opcion < 0 || opcion > array.length || Number.isNaN(opcion)) {
        alert('Opción no reconocida')
        opcion = parseInt(prompt(info))
    }
    return opcion
}

function mostrarProductos(array, str = '', atributo = ['nombre', 'sabor', 'cantidad', 'precio'], opcionCancelar = false) {
    let info = `${str}\n\n`
    array.forEach(helado => {
        info += array.indexOf(helado) + `.${helado.mostrarInfo(...atributo)}`
    })
    if (opcionCancelar) info += '\n' + array.length + '. Cancelar selección'
    return info
}

function agregarHelado(retornar = false) {
    let nombreHelado = prompt('Nombre del producto:')
    while (nombreHelados(vHelados).includes(nombreHelado)) {
        alert('Nombre del producto existente')
        nombreHelado = prompt('Nombre del producto:')
    }
    let saborHelado = prompt('Sabor del helado:')
    let cantidadHelado = parseInt(prompt('Cantidad del producto:'))
    let precioHelado = parseInt(prompt('Precio del producto'))
    let helado = new Helado(
        nombreHelado,
        saborHelado,
        cantidadHelado,
        precioHelado
    )
    if (retornar) return helado
    vHelados.push(helado)
}

function modificarHelado() {
    if (comprobarRegistro(vHelados, 'No hay productos en el inventario actualmente')) return
    let info = mostrarProductos(
        vHelados, 'Seleccione el número del producto que desea modificar:', ['nombre'], true
        )
    let opcion = comprobarOpcion(info, vHelados)
    if (opcion === vHelados.length) return

    if (window.confirm(
        '¿Está segur@ que desea modificar el siguiente producto del inventario?\n\n' + 
        vHelados[opcion].mostrarInfo('nombre', 'sabor', 'cantidad', 'precio')
        )) {
            info = 'Seleccione el número del atributo que desea modificar:\n'
            info += '\n' + vHelados[opcion].mostrarInfo('nombre', 'sabor', 'cantidad', 'precio') + '\n'
            const atributos = ['nombre', 'sabor', 'cantidad', 'precio']
            atributos.forEach(atributo => {
                info += atributos.indexOf(atributo) + '. ' + 
                    atributo.charAt(0).toUpperCase() + atributo.slice(1) + '\n'
            })
            info += atributos.length + '. Todos los atributos'
            opcionAtributo = comprobarOpcion(info, atributos)
            
            if (opcionAtributo === atributos.length) {
                vHelados[opcion] = agregarHelado(true)
                return alert('Producto modificado:\n\n'+ vHelados[opcion].mostrarInfo('nombre', 'sabor', 'cantidad', 'precio'))
            }

            let nuevoValorAtributo = prompt(`Ingrese un nuevo valor para el atributo \"${atributos[opcionAtributo]}\":`)
            if (atributos[opcionAtributo] == 'nombre' && nombreHelados(vHelados).includes(nuevoValorAtributo)) {
                return alert('Nombre del producto existente')
            }
            vHelados[opcion][atributos[opcionAtributo]] = nuevoValorAtributo
            alert('Atributo modificado:\n\n'+ vHelados[opcion].mostrarInfo('nombre', 'sabor', 'cantidad', 'precio'))
    }
}

function eliminarHelado() {
    if (comprobarRegistro(vHelados, 'No hay productos en el inventario actualmente')) return
    let info = mostrarProductos(
        vHelados, 'Seleccione el nombre del producto que desea eliminar:', ['nombre'], true
        )
    let opcion = comprobarOpcion(info, vHelados)
    if (opcion === vHelados.length) return

    if (window.confirm(
        '¿Está segur@ que desea eliminar el siguiente producto del inventario?\n\n' + 
        vHelados[opcion].mostrarInfo('nombre', 'sabor', 'cantidad', 'precio')
        )) {
            vHelados.splice(opcion, 1)
            return alert('Producto eliminado')
    }
}

function mostrarRegistro(array, str, venta = false) {
    if (comprobarRegistro(array, `No hay productos en el ${str} actualmente`)) return
    
    let info = `*** ${str.toUpperCase()} ***`
    if (venta) {
        info += mostrarProductos(array, str = '', atributo = ['nombre', 'precio', 'ventas'])
    } else {
        info += mostrarProductos(array)
    }
        
    return alert(`${info}`)
}

function realizarVenta() {
    if (comprobarRegistro(vHelados, 'No hay productos en el inventario actualmente')) return
    let info = mostrarProductos(
        vHelados, 'Seleccione el número del producto que desea comprar:', ['nombre', 'sabor', 'cantidad', 'precio'], true
        )
    let opcion = comprobarOpcion(info, vHelados)
    if (opcion === vHelados.length) return

    let helado = vHelados[opcion]
    if (helado.cantidad < 1) {
        return alert('El producto seleccionado no tiene existencias en el inventario')
    }
    
    if (window.confirm(`¿Desea comprar el producto ${helado.nombre.toUpperCase()} por valor de \$${helado.precio}?`)) {
        helado.cantidad--
        helado.ventas++
        if (vVentas.length === 0 || !nombreHelados(vVentas).includes(helado.nombre)) {
            vVentas.push({...helado})
        } else {
            vVentas[nombreHelados(vVentas).indexOf(helado.nombre)] = {...helado}
        }
        return alert('Compra realizada')
    }
}