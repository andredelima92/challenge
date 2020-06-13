const objClient = function (client)  {
    const that = {}
    
    that.id_client = client.id_client ? client.id_client : null
    that.name = client.name ? client.name : null
    that.amount_parking = client.amount_parking ? client.amount_parking : 0
    that.phone = client.phone ? client.phone : null

    that.set = (client) => {
        that.id_client = client.id_client
        that.name = client.name
        that.amount_parking = client.amount_parking
        that.phone = client.phone
    }

    that.update = (data, callback) => {
        lib.ajax({
            s: 'client',
            a: 'update',
            type: 'GET',
            data,
        }, (response) => {
            response.status && that.set(response.client)
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