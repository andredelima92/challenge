const objConfig = function() {
    const that = {}
    
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
     * Metodo construct
     */
    let init = () => {
        return that
    }

    return init()
}