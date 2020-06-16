const objConfig = function() {
    const that = {}
    
    that.dialog
    let parkingSpace = 15
    let hourValue = 15.50

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

    that.hide = () => {
        const headers = [{header: 'header_parking', view: 'vw_traffics'}
        , {header:'header_vehicles', view: 'vw_vehicles'}, {header:'header_config', view: 'vw_clients'},
         {header:'header_clients', view: 'vw_config'}, {header: 'reportBestClients',view: 'vw_report_clients'}]

        headers.forEach(el => {
            z(el.header).parentNode.classList.remove('active')
            z(el.view).classList.add('hide-screen')
        })

        return {
            view: view => {
                z(view).classList.remove('hide-screen')
                return {
                    header: header => {
                        z(header).parentNode.classList.add('active')
                    }
                }
            }
        }
    }

    that.show = (screen = 'parking') => {
        const oldScreen = document.querySelector('li.active').childNodes[1].getAttribute('id')
        if (oldScreen === 'header_parking' && that.cache.id_traffic) {
                if (z('option_parking').getValue() === '1') {
                    trafficView.changeColorSpot(that.cache.id_traffic).renew()
                } else {
                    const tr = document.querySelector(`#table_parking_payment tr[id_traffic="${config.cache.id_traffic}"]`)
                    tr.classList.remove('table-success')
                    tr.classList.add('table-danger')
                }
            
            trafficView.cleanForm()
        }

        if (screen === 'clients') {
            that.hide().view('vw_clients').header('header_clients')
            z('search_table_input').value = ''
            z('form_client_name').value = ''
            z('form_client_phone').value = ''
        }
        
        if (screen === 'parking') {
            that.hide().view('vw_traffics').header('header_parking')
        }

        if (screen === 'vehicles') {
            that.hide().view('vw_vehicles').header('header_vehicles')
            
            z('search_table_vehicle_input').value = ''
            z('form_vehicle_plate').value = ''
            z('form_vehicle_model').value = ''
        }

        if (screen === 'config')  {
            that.hide().view('vw_config').header('header_config')
        }

        if (screen === 'reportClients') {
            that.hide().view('vw_report_clients');
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
        lib.ajax({
            s: 'traffic',
            a: 'getServer',
            type: 'GET',
            data: {},
        }, (response) => {
            parkingSpace = response.config.parking_space
            hourValue = response.config.hour_value
            z('form_config_space').value = parkingSpace
            z('form_config_value').value = hourValue
            callback && callback()
        })
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

    that.update = () => {
        lib.ajax({
            s: 'traffic',
            a: 'updtConfig',
            type: 'GET',
            data: {
                config: {
                    parking_space: z('form_config_space').value,
                    hour_value: z('form_config_value').value
                }
            },
        }, (response) => {
            if (response.status === false) {
               return bootbox.alert(response.err)
            }
            bootbox.alert('Informações alteradas com sucesso, o sistema sera reiniciado para entrarem em vigor', () => {
                document.location.reload(false)
            })
        })
    }

    /**
     * Metodo construct
     */
    let init = () => {

        that.makeCloseEvents()

        z('header_config', () => that.show('config'))
        z('form_config_save', that.update)
        return that
    }

    return init()
}