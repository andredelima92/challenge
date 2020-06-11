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
        
        config.data.traffic.id = spot

        z('view_form_parking').classList.remove('hide-screen')
        z('license_plate').focus()
    }

    that.createParkingSpaces = () => {
        const spots = config.getParkingSpace()
        const doc = z('table_parking_space')

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

        const list = document.querySelectorAll('#table_parking_space tr[formspot]')
        for (let i = 0; i < spots; i++) {
            list[i].addEventListener('click', that.fillSpot)
        }
    }

    that.cancelInsertParking = () => {
        z('view_form_parking').classList.add('hide-screen')
        that.changeColorSpot(config.data.traffic.id)
        config.data.clear('traffic')
    }

    /**
     * Metodo construct
     */
    that.init = () => {
        config.getServer(() => {
            that.createParkingSpaces()  
            that.updateParkingAmounts()
        })

        z('cancelInsertSpot', that.cancelInsertParking)
        return that
    }

    that.init()
}

loadMananger(() => {
    config = new objConfig()
    parking()
})