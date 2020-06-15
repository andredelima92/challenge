const objTraffic = function (traffic)  {
    const that = {}

    that.set = (traffic) => {
        that.id_traffic = traffic.id_traffic ? traffic.id_traffic : null
        that.id_vehicle = traffic.id_vehicle ? traffic.id_vehicle : null
        that.id_client = traffic.id_client ? traffic.id_client : null
        that.entrance = traffic.entrance ? traffic.entrance : null
        that.departure = traffic.departure ? traffic.departure : null
        that.stay_time = traffic.stay_time ? traffic.stay_time : null
        that.price = traffic.price ? traffic.price : null
        that.payed = traffic.payed ? traffic.payed : null
        that.parking_space = traffic.parking_space ? traffic.parking_space : null;
        that.model = traffic.model ? traffic.model : '';
        that.license_plate = traffic.license_plate ? traffic.license_plate : '';
    }

    that.delete = callback => {
        lib.ajax({
            s: 'traffic',
            a: 'removeTraffic',
            type: 'GET',
            data: {
                traffic: {id_traffic: that.id_traffic}
            },
        }, (response) => {
            callback && callback(response)
        })
    }

    that.pay = () => {
        lib.ajax({
            s: 'traffic',
            a: 'pay',
            type: 'GET',
            data: {
                traffic: {
                    id_traffic: that.id_traffic
                }
            }
        })
    }

    that.exit = callback => {
        lib.ajax({
            s: 'traffic',
            a: 'exit',
            type: 'GET',
            data: {
                traffic: {
                    id_traffic: that.id_traffic
                },
                amount_parking: vehicleView.vehicles[config.cache.id_vehicle].amount_parking
            },
        }, (response) => {
            response.status && that.set(response.traffic)
            callback && callback(response)
        })
    }

    that.insert = (data, callback) => {
        lib.ajax({
            s: 'traffic',
            a: 'new',
            type: 'GET',
            data,
        }, (response) => {
            response.status && that.set(response.traffic)
            callback && callback(response)
        })
    }

    /**
     * Metodo construct
     */
    that.init = (traffic) => {
        that.set(traffic)
        return that
    }

    return that.init(traffic)
}