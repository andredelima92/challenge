const objTraffic = function (traffic)  {
    const that = {}
    
    that.id_traffic = traffic.id ? traffic.id_traffic : null
    that.id_vehicle = traffic.id_vehicle ? traffic.id_vehicle : null
    that.departure = traffic.departure ? traffic.departure : null
    that.stay_time = traffic.stay_time ? traffic.stay_time : null
    that.price = traffic.price ? traffic.price : null
    that.payed = traffic.payed ? traffic.payed : null
    that.parking_space = traffic.parking_space;

    that.set = (traffic) => {
        that.id_traffic = traffic.id_traffic
        that.id_vehicle = traffic.id_vehicle
        that.departure = traffic.departure
        that.stay_time = traffic.stay_time
        that.price = traffic.price
        that.payed = traffic.payed
        that.parking_space = traffic.parking_space
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
    that.init = () => {
        return that
    }

    return that.init()
}