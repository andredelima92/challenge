const objClient = function (client)  {
    const that = {}

    that.set = (client) => {
        that.id_client = client.id_client ? client.id_client : null
        that.name = client.name ? client.name : null
        that.phone = client.phone ? client.phone : null
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
    that.init = (client) => {
        that.set(client)
        return that
    }

    return that.init(client)
}