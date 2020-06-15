const objVehicle= function (vehicle)  {
    const that = {}

    that.amount_parking = 0

    that.set = (vehicle) => {
        that.id_vehicle = vehicle.id_vehicle ? vehicle.id_vehicle : ''
        that.model = vehicle.model ? vehicle.model : ''
        that.amount_parking = vehicle.amount_parking ? vehicle.amount_parking : that.amount_parking
        that.license_plate = vehicle.license_plate ? vehicle.license_plate : ''
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
    that.init = (vehicle) => {
        that.set(vehicle)
        return that
    }

    return that.init(vehicle)
}