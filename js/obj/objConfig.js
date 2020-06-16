const objConfig = function() {
    const that = {}
    
    that.dialog
    let parkingSpace = null
    let hourValue = null
    let prefix = null

    that.form = {
        license_plate: z('form_parking_license_plate'),
        model: z('form_parking_model'),        
        name: z('form_parking_name'),
        phone: z('form_parking_phone'),
        amount_parking: z('form_amount_parking')
    }

    that.disableForm = () => {
        return {
            client: () => {
                that.form.name.disabled = true
                that.form.phone.disabled = true
            },
            vehicle: () => {
                that.form.model.disabled = true
                that.form.license_plate.disabled = true
            },
            all: () => {
                that.disableForm().client()
                that.disableForm().vehicle()
            }
        }
    }

    that.show = (screen = 'parking') => {
        const oldScreen = document.querySelector('li.active').childNodes[1].getAttribute('id')
        if (oldScreen === 'header_parking' && that.cache.id_traffic) {
            trafficView.changeColorSpot(that.cache.id_traffic).renew()
            trafficView.cleanForm()
        }

        if (screen === 'clients') {
            z('header_parking').parentNode.classList.remove('active')
            z('header_vehicles').parentNode.classList.remove('active')
            z('header_clients').parentNode.classList.add('active')
            
            z('vw_traffics').classList.add('hide-screen')
            z('vw_vehicles').classList.add('hide-screen')
            z('vw_clients').classList.remove('hide-screen')
            z('search_table_input').value = ''
            z('form_client_name').value = ''
            z('form_client_phone').value = ''
        }
        
        if (screen === 'parking') {
            z('header_parking').parentNode.classList.add('active')
            z('header_vehicles').parentNode.classList.remove('active')
            z('header_clients').parentNode.classList.remove('active')
            
            z('vw_traffics').classList.remove('hide-screen')
            z('vw_vehicles').classList.add('hide-screen')
            z('vw_clients').classList.add('hide-screen')
        }

        if (screen === 'vehicles') {
            z('header_parking').parentNode.classList.remove('active')
            z('header_vehicles').parentNode.classList.add('active')
            z('header_clients').parentNode.classList.remove('active') 

            z('vw_traffics').classList.add('hide-screen')
            z('vw_vehicles').classList.remove('hide-screen')
            z('vw_clients').classList.add('hide-screen')

            z('search_table_vehicle_input').value = ''
            z('form_vehicle_plate').value = ''
            z('form_vehicle_model').value = ''
        }

        config.cache.clear()
    }
    
    that.enableForm = () => {
        return {
            client: () => {
                that.form.name.disabled = false
                that.form.phone.disabled = false
            },
            vehicle: () => {
                that.form.model.disabled = false
                that.form.license_plate.disabled = false
            },
            all: () => {
                that.enableForm().client()
                that.enableForm().vehicle()
            }
        }
    }

    that.cache = {
        id_client: null,
        id_traffic: null,
        id_vehicle: null,
        clear: () => {            
            that.cache.id_client = null
            that.cache.id_traffic = null
            that.cache.id_vehicle = null
        }
    }

    /**
     * Metodo get do objeto
     */
    that.getParkingSpace = () => {
        return parkingSpace    
    }

    /**
     * Metodo get do objeto
     */
    that.getHourValue = () => {
        return hourValue
    }

    /**
     * Metodo get do objeto
     */
    that.getPrefix = () => {
        return prefix
    }

    that.getServer = (callback) => {
        parkingSpace = 15
        hourValue = 15.50
        prefix = 14

        callback && callback()
    }

     /**
     * Metodo realiza o fechamento da tela de pesquisa de no formulario traffic
     */
    that.closeFormSearch = (e) => {
        const id = e.target.parentNode.parentNode.parentNode.parentNode.id

        z(id).style.display = 'none'
    }

    that.makeCloseEvents = () => {
        const el = document.getElementsByClassName('close')

        for (let i = el.length - 1; i >= 0; i--) {
            el[i].addEventListener('click', that.closeFormSearch)
        }
    }

    /**
     * Metodo construct
     */
    let init = () => {

        that.makeCloseEvents()
        return that
    }

    return init()
}