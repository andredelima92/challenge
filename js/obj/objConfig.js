const objConfig = function() {
    const that = {}
    
    let parkingSpace = null
    let hourValue = null
    let prefix = null

    that.data = {
        client:   {
            id: null,
        },
        traffic:  {
            id: null
        },
        vehicles: {
            id: null
        },
        clear: (param) => {
            if (param) return that.data[param].id = null
            
            that.data[param].client.id = null
            that.data[param].traffic.id = null
            that.data[param].vehicles.id = null
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