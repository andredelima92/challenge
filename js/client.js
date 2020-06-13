const client = () => {
    const that = {}
    that.clients = []
    
    that.fillObject = clients => {
        clients.forEach(el => {
            that.clients[el.id_client] = new objClient(el)
        })
    }

    that.updateLocalObject = (client) => {
        config.cache.id_client = client.id_client
        
        that.clients[client.id_client] = new objClient(client)

    }

    /**
     * Metodo pega todos os clientes cadastrados no servidor e carrega pra memoria
     */
    that.getClientsToMemory = () => {
        lib.ajax({
            s: 'client',
            a: 'get',
            type: 'GET',
            data: {},
        }, (response) => {
            that.fillObject(response.clients)
        })
    }
    
      /**
     * Metodo construct
     */
    that.init = () => {
        that.getClientsToMemory()
        return that
    }

    return that.init()
}

loadMananger(() => {
    clientView = client()
})