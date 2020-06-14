const traffic = () => {
    const that = {}
    that.traffics = []

    that.updateParkingAmounts = () => {
        let total = config.getParkingSpace()
        let busy = Object.keys(that.traffics).length

        z('freeAmount').textContent = total - busy
        z('busyAmount').textContent = busy
    }

    that.changeColorSpot = spot => {
        const tr = document.querySelector(`tr[formspot="${spot}"]`)

        if (that.traffics[spot]) {
            tr.classList.add('table-danger')
            tr.classList.remove('table-success')
            
            return true
        }

        tr.classList.toggle('table-success')
        tr.classList.toggle('table-danger')
    }

    that.fillForm = () => {
        const spot = config.cache.id_traffic
        const traffic = that.traffics[spot]
        
        if (traffic === undefined) {
            z('btn_new_traffic').classList.remove('hide-screen')
            return false
        }
        
        z('btn_new_traffic').classList.add('hide-screen')
        config.form.model.value = traffic.model
        config.form.license_plate.value = traffic.license_plate
        clientView.fillFormClient(traffic.id_client)
    }

    /**
     * Metodo responsavel por pegar o click feito na tabela e abrir o formulario
     * @param {event click} e 
     */
    that.fillSpot = e => {
        const spot = e.target.parentNode.getAttribute('formspot')
        
        that.changeColorSpot(spot)
        
        //Elimino a cor ocupada da vaga anterior
        if (config.cache.id_traffic) {
            that.changeColorSpot(config.cache.id_traffic)
            
            that.traffics[config.cache.id_traffic] && that.cleanForm()
        }

        config.cache.id_traffic = spot

        that.fillForm()
        z('view_form_parking').classList.remove('hide-screen')
        z('form_parking_license_plate').focus()
    }

    that.createLine = (traffic = {}) => {        
        const tr = document.createElement('tr')
        
        tr.setAttribute('class', 'table-success center-text')
        tr.setAttribute('formspot', traffic.parking_space)
        
        const spot = document.createElement('td')
        spot.textContent = traffic.parking_space
        tr.append(spot)
        
        const model = document.createElement('td')
        tr.append(model)
        
        const plate = document.createElement('td')
        tr.append(plate)

        const entrance = document.createElement('td')
        tr.append(entrance)
        
        return tr
    }

    that.createParkingSpaces = () => {
        const spots = config.getParkingSpace()
        const table = z('table_parking')
        
        for (let i = 0; i < spots; i++) {
            const tr = that.createLine({parking_space: i + 1})
            table.append(tr)    
        }

        const list = table.childNodes
        for (let i = 0; i < spots; i++) {
            list[i].addEventListener('click', that.fillSpot)
        }
    }

    that.cleanForm = (id = 'form_traffic') => {
        const inputs = document.querySelectorAll(`#${id} input`)
        for (let i = inputs.length - 1; i >= 0; i--) {
            inputs[i].value = ''
        }

        config.form.amount_parking.textContent = 0
        z('view_form_parking').classList.add('hide-screen')
        config.cache.id_client = null
        config.cache.id_vehicle = null
    }

    that.cancelInsertParking = () => {
        that.changeColorSpot(config.cache.id_traffic)
        that.cleanForm()
        config.cache.clear()
    }

    that.updateTrafficLine = traffic => {
        const line = document.querySelector(`tr[formspot="${traffic.parking_space}"]`)
        line.childNodes[1].textContent = traffic.model && traffic.model.toUpperCase()
        line.childNodes[2].textContent = traffic.license_plate && traffic.license_plate.toUpperCase()
        line.childNodes[3].textContent = traffic.entrance && lib.formatDate(traffic.entrance)
    }

    that.newTraffic = () => {
        const spot = config.cache.id_traffic

        let data = {
            vehicle: {
                license_plate: config.form.license_plate.value.trim(),
                model: config.form.model.value.trim()
            },
            client: {
                id_client: config.cache.id_client ? config.cache.id_client : null,
                name: config.form.name.value.trim(),
                phone: config.form.phone.value.trim()
            },
            traffic: {
                parking_space: spot
            }
        }

        if (that.traffics[spot] === undefined) {
            that.traffics[spot] = new objTraffic({parking_space: spot})
        }
        
        that.traffics[spot].insert(data, response => {
            
            if (response.client) {
                clientView.updateLocalObject({
                    id_client: response.client,
                    name: data.client.name,
                    phone: data.client.phone,
                })
            }

            if (response.vehicle) {
                vehicleView.updateLocalObject({
                    id_vehicle: response.vehicle,
                    license_plate: data.vehicle.license_plate,
                    model: data.vehicle.model,
                })
            }

            if (response.status === false) {
                that.traffics[spot] = undefined
                return alert(response.err)
            }
            
            clientView.clients[response.client].amount_parking++
            that.updateTrafficLine(that.traffics[spot])
            that.updateParkingAmounts()
            that.cleanForm()
        })
    }

    /**
     * Metodo pega todos os traffics no array, instancia os objetos e atualiza a tela
     * @param {arry} traffics 
     */
    that.fillObjectInTable = traffics => {
        traffics.forEach(el => {
            const spot = el.parking_space

            that.traffics[spot] = new objTraffic(el)
            that.updateTrafficLine(that.traffics[spot])
            that.changeColorSpot(spot)
        })

        that.updateParkingAmounts()
    }

    /**
     * Metodo busca os traffics ja existentes e atualiza a tela com os mesmos
     */
    that.getUsingTraffics = () => {
        lib.ajax({
            s: 'traffic',
            a: 'getUsingTraffics',
            type: 'GET',
            data: {},
        }, (response) => {
            that.fillObjectInTable(response.traffics)
        })
    }

    /**
     * Metodo construct
     */
    that.init = () => {
        config.getServer(() => {
            that.createParkingSpaces()  
            that.updateParkingAmounts()
            that.getUsingTraffics()
        })

        z('form_parking_save', that.newTraffic)
        z('form_parking_cancel', that.cancelInsertParking)
        return that
    }

    return that.init()
}

loadMananger(() => {
    config = new objConfig
    trafficView = traffic()
})