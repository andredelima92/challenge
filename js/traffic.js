const traffic = () => {
    const that = {}
    that.traffics = []

    that.updateParkingAmounts = () => {
        z('freeAmount').textContent = config.getParkingSpace()
        z('busyAmount').textContent = 0
    }

    that.changeColorSpot = (spot) => {
        const tr = document.querySelector(`tr[formspot="${spot}"]`)
        tr.classList.toggle('table-success')
        tr.classList.toggle('table-danger')
    }

    that.fillSpot = (e) => {
        const spot = e.target.parentNode.getAttribute('formspot')
        that.changeColorSpot(spot)
        
        //Elimino a cor ocupada da vaga anterior
        config.data.traffic.id && that.changeColorSpot(config.data.traffic.id)

        config.data.traffic.id = spot

        z('view_form_parking').classList.remove('hide-screen')
        z('form_parking_license_plate').focus()
    }

    that.createLine = (traffic = {}) => {        
        const tr = document.createElement('tr')
        
        if (traffic.entrance) tr.setAttribute('class', 'table-danger')
        else tr.setAttribute('class', 'table-danger')
        
        tr.setAttribute('formspot', traffic.parking_spot)
        
        const spot = document.createElement('td')
        spot.textContent =  traffic.parking_spot 
        tr.append(spot)

        const model = document.createElement('td')
        traffic.model ? model.textContent = traffic.model : model.textContent = ''
        tr.append(model)

        const plate = document.createElement('td')
        traffic.plate ? plate.textContent = traffic.plate : plate.textContent = ''
        tr.append(plate)

        const entrance = document.createElement('td')
        traffic.entrance ? entrance.textContent = traffic.entrance : entrance.textContent = ''
        tr.append(entrance)
        
        return tr
    }

    that.createParkingSpaces = () => {
        const spots = config.getParkingSpace()
        const table = z('table_parking')
        
        for (let i = 0; i < spots; i++) {
            const tr = that.createLine({parking_spot: i + 1})
            table.append(tr)
            
        }

        const list = table.childNodes
        for (let i = 0; i < spots; i++) {
            list[i].addEventListener('click', that.fillSpot)
        }
    }

    that.cancelInsertParking = () => {
        z('view_form_parking').classList.add('hide-screen')
        that.changeColorSpot(config.data.traffic.id)
        config.data.clear('traffic')
    }

    that.updateTrafficLine = (traffic) => {
        const line = document.querySelector(`tr[formspot="${traffic.parking_space}"]`)
        line.remove()


    }

    that.newTraffic = () => {
        const spot = config.data.traffic.id

        let data = {
            vehicle: {
                license_plate: z('form_parking_license_plate').value.trim(),
                model: z('form_parking_model').value.trim()
            },
            client: {
                name: z('form_parking_name').value.trim(),
                phone: z('form_parking_phone').value.trim()
            },
            traffic: {
                parking_space: spot
            }
        }

        if (that.traffics[spot] === undefined) {
            that.traffics[spot] = new objTraffic({parking_spot: spot})
        }
        
        that.traffics[spot].insert(data, (response) => {
            if (response.status === false) {
                return alert(response.err)
            }
            
            that.updateTrafficLine(that.traffics[spot])
        })
    }

    /**
     * Metodo construct
     */
    that.init = () => {
        config.getServer(() => {
            that.createParkingSpaces()  
            that.updateParkingAmounts()
        })

        z('form_parking_save', that.newTraffic)
        z('form_parking_cancel', that.cancelInsertParking)
        return that
    }

    return that.init()
}

loadMananger(() => {
    config = new objConfig
    p = traffic()
})