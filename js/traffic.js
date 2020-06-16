const traffic = () => {
    const that = {}
    that.traffics = []
    that.pendencys = []

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
        const tr = document.querySelector(`#table_parking tr[formspot="${spot}"]`)

        if (that.traffics[spot]) {
            tr.classList.add('table-danger')
            tr.classList.remove('table-success')
        } else {
            tr.classList.add('table-success')
            tr.classList.remove('table-danger')
        }

        return {
            renew: () => {
                if (that.traffics[spot]) return
                tr.classList.remove('table-danger')
                tr.classList.add('table-success')
            }
        }
    }

    that.fillForm = () => {
        const spot = config.cache.id_traffic
        const traffic = that.traffics[spot]
        z('form_search').style.display = 'none'
        z('form_search_vehicle').style.display = 'none'
        
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
        if (config.cache.id_traffic && config.cache.id_traffic != spot) {
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
        line.childNodes[3].textContent = traffic.entrance ? traffic.entrance : ''
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
                const client = {
                    id_client: response.client,
                    name: data.client.name,
                    phone: data.client.phone
                }
                clientView.updateLocalObject(client)
                clientView.append(client, 'table_clients')
            }

            if (response.vehicle) {
                const vehicle = {
                    id_vehicle: response.vehicle,
                    license_plate: data.vehicle.license_plate,
                    model: data.vehicle.model
                }
                vehicleView.updateLocalObject(vehicle)
                vehicleView.append(vehicle, 'table_vehicles')
            }

            if (response.status === false) {
                that.traffics[spot] = undefined
                return bootbox.alert(response.err)
            }
            
            vehicleView.vehicles[response.vehicle].amount_parking++
            that.updateTrafficLine(that.traffics[spot])
            that.updateParkingAmounts()
            that.cleanForm()
        })
    }

    /**
     * Cria a linha para a tabela de pendencias
     * @param {object} traffic 
     */
    that.createPendencyLine = (traffic) => {
        const tr = document.createElement('tr')
        tr.setAttribute('class', 'table-danger')
        tr.setAttribute('id_traffic', traffic.id_traffic)
        
        const plate = document.createElement('td')
        plate.textContent = traffic.license_plate
        tr.append(plate)
        
        const entrance = document.createElement('td')
        entrance.textContent = traffic.entrance
        tr.append(entrance)

        const departure = document.createElement('td')
        departure.textContent = traffic.departure
        tr.append(departure)

        const stay_time = document.createElement('td')
        stay_time.textContent = traffic.stay_time
        tr.append(stay_time)
        
        const price = document.createElement('td')
        price.setAttribute('class', 'text-success')
        price.textContent = traffic.price
        tr.append(price)

        return tr
    }

    that.fillPendencysTable = (pendencys = that.pendencys) => {
        const table = z('table_parking_payment')

        pendencys.forEach(el => {
            const tr = that.createPendencyLine(el)
            table.appendChild(tr)
        })
    }

    /**
     * Metodo pega todos os traffics no array, instancia os objetos e atualiza a tela
     * @param {arry} traffics 
     */
    that.fillObjectInTable = traffics => {
        traffics.forEach(el => {
            if (el.departure) {
                return that.pendencys[el.id_traffic] = new objTraffic(el)
            }

            const spot = el.parking_space
            
            that.traffics[spot] = new objTraffic(el)
            that.updateTrafficLine(that.traffics[spot])
            that.changeColorSpot(spot)
        })

        that.fillPendencysTable()
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

    that.removeTrafficInUse = (spot) => {
        that.traffics[spot].delete(response => {
            if (response.status) {
                vehicleView.vehicles[that.traffics[spot].id_vehicle].amount_parking--
                that.traffics[spot] = undefined
                that.updateTrafficLine({parking_space: spot})
                that.cleanForm()
                that.changeColorSpot(spot)
                return that.updateParkingAmounts()
            }

            bootbox.alert(response.err)
        })
    }

    that.removeTrafficPendency = (id_traffic) => {
        that.pendencys[id_traffic].delete(response => {
            if (response.status) {
                vehicleView.vehicles[that.pendencys[id_traffic].id_vehicle].amount_parking--
                that.pendencys[id_traffic] = undefined
                that.cleanForm()

                const tr = document.querySelector(`#table_parking_payment tr[id_traffic="${id_traffic}"]`)
                return tr.remove()
            }

            bootbox.alert(response.err)
        })
    }

    that.removeTraffic = () => {
        const spot = config.cache.id_traffic
        const  opt = z('option_parking').getValue()

        if (opt === "1") {
            return that.removeTrafficInUse(spot)
        }

        return that.removeTrafficPendency(spot)
    }

    /**
     * Metodo realiza a troca da visualização da tela de vagas em aberto pro financeiro pendente
     */
    that.showPendency = () => {
        const  opt = z('option_parking').getValue()
        
        if (opt === '1') { // ver as vagas de estacionamento
            if (config.cache.id_traffic) {
                const tr = document.querySelector(`#table_parking_payment tr[id_traffic="${config.cache.id_traffic}"]`)
                tr.classList.remove('table-success')
                tr.classList.add('table-danger')
            }

            that.cleanForm()
            z('table_parking_view').classList.remove('hide-screen')
            return z('table_payment_view').classList.add('hide-screen')
        }
        
        if (config.cache.id_traffic) {
            const tr = document.querySelector(`#table_parking tr[formspot="${config.cache.id_traffic}"]`)
            tr.classList.add('table-success')
            tr.classList.remove('table-danger')
        }

        that.cleanForm()
        config.disableForm().all()
        z('btn_new_traffic').classList.add('hide-screen')
        z('btn_edit_traffic').classList.remove('hide-screen')
        z('table_payment_view').classList.remove('hide-screen')
        z('table_parking_view').classList.add('hide-screen')
    }

    /**
     * Cria a tela de recebimento
     * @param {object} traffic 
     * @param {evento de callback} callback 
     */
    that.makeViewPayment = (traffic, callback) => {
        bootbox.confirm({
            title: `<p>Veículo:${traffic.model}</p> <p>Placa:${traffic.license_plate}</p>`,
            message: `<p>Entrada:<span class='text-primary'>${traffic.entrance}</span></p><p>Saída:<span class='text-warning'>${traffic.departure}</span></p><p>Permanência:<span class='text-danger'>${traffic.stay_time}</span></p><p>Valor:<span class='text-success' style='font-size: 30px;'>R$${traffic.price}</span></p><p class='text-info'>Quantidade:${vehicleView.vehicles[traffic.id_vehicle].amount_parking}</p>`,
            size: 'large',
            buttons: {
                confirm: {
                    label: "Confirmar Recebimento",
                    className: 'btn-success',
                },
                cancel: {
                    label: "Receber mais tarde",
                    className: 'btn-danger',
                },
            },
            callback: function (result) {
                callback && callback(result)
            }
        });
    }

    /**
     * Metodo realiza a baixa do veiculo na vaga
     */
    that.exitTraffic = () => {
        const  opt = z('option_parking').getValue()
        
        if (opt === "2") {
            that.pendencys[config.cache.id_traffic].pay()
            const tr = document.querySelector(`#table_parking_payment tr[id_traffic="${config.cache.id_traffic}"]`)
            tr.remove()
            that.pendencys[config.cache.id_traffic] = undefined
            return that.cleanForm()
        }

        that.traffics[config.cache.id_traffic].exit(response => {
            if (!response.status) {
                return bootbox.alert(response.err)
            }

            that.makeViewPayment(response.traffic, result => {
                const spot = response.traffic.parking_space
                
                that.updateTrafficLine({parking_space: spot})
                that.cleanForm() //ja limpa o cache

                if (result === true) {    
                    that.traffics[spot].pay()
                    that.traffics[spot] = undefined
                    that.changeColorSpot(spot)
                    return that.updateParkingAmounts()
                }
                
                that.traffics[spot] = undefined
                that.changeColorSpot(spot)
                that.updateParkingAmounts()
                that.fillPendencysTable([response.traffic])
                that.pendencys[response.traffic.id_traffic] = new objTraffic(response.traffic)
            })
        })
    }

    that.fillPendencyForm = () => {
        const id_traffic = config.cache.id_traffic
        const traffic = that.pendencys[id_traffic]
        z('form_search').style.display = 'none'
        z('form_search_vehicle').style.display = 'none'
        
        vehicleView.fillFormVehicle(traffic.id_vehicle)
        clientView.fillFormClient(traffic.id_client)
    }

    that.showPaymentForm = e => {
        const tr = e.target.parentNode
        const id_traffic = tr.getAttribute('id_traffic')
        
        tr.classList.add('table-success')
        tr.classList.remove('table-danger')
        
        //Elimino a cor da pendency anterior
        if (config.cache.id_traffic && config.cache.id_traffic != id_traffic) {
            const oldTr = document.querySelector(`#table_parking_payment tr[id_traffic="${config.cache.id_traffic}"]`)
            oldTr.classList.add('table-danger')
            oldTr.classList.remove('table-success')
            
            that.cleanForm()
        }

        config.cache.id_traffic = id_traffic

         that.fillPendencyForm()
         z('view_form_parking').classList.remove('hide-screen')
    }

    that.headerTraffics = () => {
        config.show()
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

        z('header_parking', that.headerTraffics)
        z('table_parking_payment', that.showPaymentForm)
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