const traffic = () => {
    const that = {}
    that.traffics = []

    that.updateParkingAmounts = () => {
        let total = config.getParkingSpace()
        let busy = 0 
        
        that.traffics.forEach(e => {
            if (e !== undefined) busy++
        })

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

        tr.classList.add('table-success')
        tr.classList.remove('table-danger')
    }

    that.fillForm = () => {
        const spot = config.cache.id_traffic
        const traffic = that.traffics[spot]
        
        if (traffic === undefined) {
            config.enableForm().all()
            z('btn_new_traffic').classList.remove('hide-screen')
            z('btn_edit_traffic').classList.add('hide-screen')
            return false
        }
        
        config.disableForm().all()
        z('btn_new_traffic').classList.add('hide-screen')
        z('btn_edit_traffic').classList.remove('hide-screen')
        vehicleView.fillFormVehicle(traffic.id_vehicle)
        clientView.fillFormClient(traffic.id_client)
    }

    /**
     * Metodo responsavel por pegar o click feito na tabela e abrir o formulario
     * @param {event click} e 
     */
    that.fillSpot = e => {
        const tr = e.target.parentNode
        const spot = tr.getAttribute('formspot')
        
        tr.classList.add('table-danger')
        tr.classList.remove('table-success')
        
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
    }

    that.cleanForm = (id = 'form_traffic') => {
        const inputs = document.querySelectorAll(`#${id} input`)
        for (let i = inputs.length - 1; i >= 0; i--) {
            inputs[i].value = ''
        }

        config.form.amount_parking.textContent = 0
        z('view_form_parking').classList.add('hide-screen')
        config.cache.clear()
    }

    that.cancelInsertParking = () => {
        that.changeColorSpot(config.cache.id_traffic)
        that.cleanForm()
        config.cache.clear()
    }

    that.updateTrafficLine = traffic => {
        const line = document.querySelector(`tr[formspot="${traffic.parking_space}"]`)
        line.childNodes[1].textContent = traffic.model ? traffic.model.toUpperCase() : ''
        line.childNodes[2].textContent = traffic.license_plate ? traffic.license_plate.toUpperCase() : ''
        line.childNodes[3].textContent = traffic.entrance ? lib.formatDate(traffic.entrance) : ''
    }

    that.newTraffic = () => {
        const spot = config.cache.id_traffic

        let data = {
            vehicle: {
                id_vehicle: config.cache.id_vehicle ? config.cache.id_vehicle : null,
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
            
            vehicleView.vehicles[response.vehicle].amount_parking++
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

    that.removeTraffic = e => {
        const spot = config.cache.id_traffic
        
        that.traffics[spot].delete(response => {
            if (response.status) {
                vehicleView.vehicles[that.traffics[spot].id_vehicle].amount_parking--
                that.traffics[spot] = undefined
                that.updateTrafficLine({parking_space: spot})
                that.cleanForm()
                that.changeColorSpot(spot)
                config.cache.clear()
                that.updateParkingAmounts()
            }
        })
    }

    /**
     * Metodo realiza a troca da visualização da tela de vagas em aberto pro financeiro pendente
     */
    that.showPendency = () => {
        const  opt = z('option_parking').getValue()
        
        if (opt === '1') {
            z('table_parking_view').classList.remove('hide-screen')
            return z('table_payment_view').classList.add('hide-screen')
        }

        z('table_payment_view').classList.remove('hide-screen')
        z('table_parking_view').classList.add('hide-screen')
    }

    that.exitTraffic = () => {
        that.traffics[config.cache.id_traffic].exit(responde => {
            if (!response.status) {
                return alert(response.err)
            }


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

        z('table_parking', that.fillSpot)
        z('option_parking', that.showPendency, 'change')
        z('form_parking_pay', that.exitTraffic)
        z('form_parking_save', that.newTraffic)
        z('form_parking_delete', that.removeTraffic)
        z('form_parking_cancel', that.cancelInsertParking)
        return that
    }

    return that.init()
}

loadMananger(() => {
    config = new objConfig
    trafficView = traffic()
})