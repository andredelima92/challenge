const parking = () => {
    const that = {}
    let traffic = null

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
        
        config.data.traffic.id && that.changeColorSpot(config.data.traffic.id)

        config.data.traffic.id = spot

        z('view_form_parking').classList.remove('hide-screen')
        z('form_parking_license_plate').focus()
    }

    that.createParkingSpaces = () => {
        const spots = config.getParkingSpace()
        const doc = z('table_parking')

        let html = ''
        
        for (let i = 0; i < spots; i++) {
            html += `<tr class="table-success" formspot="${i + 1}">
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                     </tr>
            `
        }

        doc.innerHTML = html

        const list = document.querySelectorAll('#table_parking tr[formspot]')
        for (let i = 0; i < spots; i++) {
            list[i].addEventListener('click', that.fillSpot)
        }
    }

    that.cancelInsertParking = () => {
        z('view_form_parking').classList.add('hide-screen')
        that.changeColorSpot(config.data.traffic.id)
        config.data.clear('traffic')
    }

    that.newTraffic = () => {
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
                parking_space: config.data.traffic.id
            }
        }

        lib.ajax({
            s: 'traffic',
            a: 'new',
            type: 'GET',
            data: data
        }, (data) => {
            if (data.status === false) {
                return alert(data.err)
            }

            alert('registro incluido com sucesso')
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

    that.init()
}

loadMananger(() => {
    config = new objConfig()
    parking()
})