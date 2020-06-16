const vehicle = () => {
    const that = {}
    that.vehicles = []
    
    that.fillObject = vehicles => {
        vehicles.forEach(el => {
            that.vehicles[el.id_vehicle] = new objVehicle(el)
        })
    }

      /**
     * Metodo cria a table usada para pesquisa dos veiculos ao incluir um traffic
     */
    that.fillTableForSearchTrafficVehicle = () => {
        const table = z('form_search_vehicle_body')

        let html = ''

        that.vehicles.forEach(el => {
            html +=
            `<tr id_vehicle="${el.id_vehicle}">
                <td>${el.license_plate}</td>
                <td>${el.model ? el.model : ''}</td>
            </tr>
            `
        })

        table.innerHTML = html
    }

    /**
     * Metodo realiza a alteração da tabela de pesquisa de veiculos com um novo veiculo criado
     * @param {object} vehicle 
     */
    that.append = (vehicle, id) => {
        const table = z(id)
        const tr = document.createElement('tr')
        tr.setAttribute('id_vehicle', vehicle.id_vehicle)
        
        const tdLicense = document.createElement('td')
        tdLicense.textContent = vehicle.license_plate
        
        const tdModel = document.createElement('td')
        tdModel.textContent = vehicle.model ? vehicle.model : ''

        tr.appendChild(tdLicense)
        tr.appendChild(tdModel)

        table.appendChild(tr)
    }

    /**
     * Metodo invocado principalmente pelo traffic para atualizar os objetos na memoria
     * @param {object} vehicle 
     */
    that.updateLocalObject = (vehicle) => {
        config.cache.id_vehicle = vehicle.id_vehicle
        
        if (!that.vehicles[vehicle.id_vehicle]) {
            that.vehicles[vehicle.id_vehicle] = new objVehicle(vehicle)
            return that.append(that.vehicles[vehicle.id_vehicle], 'form_search_vehicle_body')
        }
        
        that.vehicles[vehicle.id_vehicle].set(vehicle)
    }

      /**
     * Metodo seleciona o veiculo dentro de um search criado pelo formSearchVehicle
     * @param {event click} e 
     */
    that.selectVehicleFromSearch = (e) => {
        const id_vehicle = e.target.parentNode.getAttribute('id_vehicle')
        that.fillFormVehicle(id_vehicle)
        
        z('form_search_vehicle').style.display = 'none'
    }

      /**
     * Meodo realiza a pesquisa de veiculos na memoria 
     * @param {event da digitação} e 
     */
    that.formSearchVehicle = e => {
        const val = e.target.value.toLowerCase()
        const table = z('form_search_vehicle_body')
        const search = z('form_search_vehicle')
        
        if (val.length === 0) {
            search.style.display = 'none'
            return false
        }
        
        search.style.display = 'table'
        
        let anyRegister = false
        const length = table.rows.length

        if (length === 0) return search.style.display = 'none'
                
        for (let i = 0; i < length ; i++) {
            const td = table.rows[i].cells[0].innerText;
            
            const isSimilar = td.toLowerCase().indexOf(val) >= 0;

            if (isSimilar) {
                anyRegister = true
                table.rows[i].style.display = ''
                continue
            }

            if (i === (length - 1) && anyRegister === false) {
                search.style.display = 'none'
            }

            table.rows[i].style.display = 'none'
        }
    }

     /**
     * Metodo responsavel por preencher os dados do veiculo no formulario do traffic e colocar a variavel no cache
     * @param {int} id_vehicle 
     */
    that.fillFormVehicle = (id_vehicle) => {
        config.cache.id_vehicle = id_vehicle

        config.form.license_plate.value = that.vehicles[id_vehicle].license_plate
        config.form.model.value = that.vehicles[id_vehicle].model
        config.form.amount_parking.textContent = that.vehicles[id_vehicle].amount_parking
    }

       /**
     * Metodo cria a table usada para pesquisa na tela de veiculos
     */
    that.fillTableForSearchVehicle = () => {
        const table = z('table_vehicles')

        that.vehicles.forEach(el => {
            that.append(that.vehicles[el.id_vehicle], 'table_vehicles')
        })
    }

    /**
     * Metodo pega todos os clientes cadastrados no servidor e carrega pra memoria
     */
    that.getVehiclesToMemory = () => {
        lib.ajax({
            s: 'vehicle',
            a: 'get',
            type: 'GET',
            data: {},
        }, (response) => {
            that.fillObject(response.vehicles)
            that.fillTableForSearchTrafficVehicle()
            that.fillTableForSearchVehicle()
        })
    }

      /**
     * Metodo realiza a pesquisa na tela de veiculos
     */
    that.searchVehicletTable = e => {
        const val = e.target.value.toLowerCase()
        const table = z('table_vehicles')
        const length = table.rows.length
                
        for (let i = 0; i < length ; i++) {
            const td = table.rows[i].cells[0].innerText;
            const td2 = table.rows[i].cells[1].innerText;
            
            const isSimilar = td.toLowerCase().indexOf(val) >= 0;
            const isSimilar2 = td2.toLowerCase().indexOf(val) >= 0;

            if (isSimilar || isSimilar2) {
                table.rows[i].style.display = ''
                continue
            }

            table.rows[i].style.display = 'none'
        }
    }

    that.editVehicle = () => {
        that.vehicles[config.cache.id_vehicle].update({
            vehicle: {
                id_vehicle: config.cache.id_vehicle,
                license_plate: z('form_vehicle_plate').value.trim(),
                model: z('form_vehicle_model').value.trim()
            }
        }, (response) => {
            if (response.status === false) {
                return bootbox.alert(response.err)
            }
            
            const tr = document.querySelector(`#table_vehicles tr[id_vehicle="${config.cache.id_vehicle}"]`)
            tr.childNodes[0].textContent = that.vehicles[config.cache.id_vehicle].license_plate
            tr.childNodes[1].textContent = that.vehicles[config.cache.id_vehicle].model
            that.append(that.vehicles[config.cache.id_vehicle], 'form_search_vehicle_body')
            
            const traffic = trafficView.traffics.find(el => {
                if(!el) return
                return el.license_plate === that.vehicles[config.cache.id_vehicle].license_plate
            })
            traffic.model = z('form_vehicle_model').value.trim()
            trafficView.updateTrafficLine(traffic)
            
            bootbox.alert('Veículo atualizado com sucesso!')
        })
    }

    that.getEditVehicle = e => {
        const id_vehicle = e.target.parentNode.getAttribute('id_vehicle')
        const vehicle = that.vehicles[id_vehicle]
        
        z('form_vehicle_plate').value = vehicle.license_plate
        z('form_vehicle_model').value = vehicle.model

        config.cache.id_vehicle = id_vehicle
    }

    that.searchVehicleTable = e => {
        const val = e.target.value.toLowerCase()
        const table = z('table_vehicles')
        const length = table.rows.length
                
        for (let i = 0; i < length ; i++) {
            const td = table.rows[i].cells[0].innerText;
            const td2 = table.rows[i].cells[1].innerText;
            
            const isSimilar = td.toLowerCase().indexOf(val) >= 0;
            const isSimilar2 = td2.toLowerCase().indexOf(val) >= 0;

            if (isSimilar || isSimilar2) {
                table.rows[i].style.display = ''
                continue
            }

            table.rows[i].style.display = 'none'
        }
    }

    that.headerVehicles = () => {
        config.show('vehicles')
    }
    
      /**
     * Metodo construct
     */
    that.init = () => {
        that.getVehiclesToMemory()

        z('search_table_vehicle_input', that.searchVehicleTable, 'input')
        z('header_vehicles', that.headerVehicles)
        z('table_vehicles', that.getEditVehicle)
        z('form_vehicle_save', that.editVehicle)
        z('form_parking_license_plate', that.formSearchVehicle, 'input')
        z('form_search_vehicle_body', that.selectVehicleFromSearch)

        return that
    }

    return that.init()
}

loadMananger(() => {
    vehicleView = vehicle()
})