const objVehicle= function (vehicle)  {
    const that = {}
    
    that.id_vehicle= vehicle.id_vehicle ? vehicle.id_vehicle : null
    that.model = vehicle.model ? vehicle.model : null
    that.license_plate = vehicle.license_plate ? vehicle.license_plate : null

    that.set = (vehicle) => {
        that.id_vehicle = vehicle.id_vehicle ? vehicle.id_vehicle : that.id_vehicle
        that.model = vehicle.model ? vehicle.model : that.model
        that.license_plate = vehicle.license_plate ? vehicle.license_plate : that.license_plate
    }

    that.update = (data, callback) => {
        lib.ajax({
            s: 'vehicle',
            a: 'update',
            type: 'GET',
            data,
        }, (response) => {
            response.status && that.set(response.vehicle)
            callback && callback(response)
        })
    }

    /**
     * Metodo construct
     */
    that.init = () => {
        return that
    }

    return that.init()
}