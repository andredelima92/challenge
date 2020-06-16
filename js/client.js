const client = () => {
    const that = {}
    that.clients = []
    
    that.fillObject = clients => {
        clients.forEach(el => {
            that.clients[el.id_client] = new objClient(el)
        })
    }

     /**
     * Metodo cria a table usada para pesquisa dos clientes ao incluir um traffic
     */
    that.fillTableForSearchTrafficClient = () => {
        const table = z('form_search_body')

        let html = ''
        
        that.clients.forEach(el => {
            html +=
            `<tr id_client="${el.id_client}">
                <td>${el.name}</td>
                <td>${el.phone ? el.phone : ''}</td>
            </tr>
            `
        })

        table.innerHTML = html
    }

      /**
     * Metodo cria a table usada para pesquisa dos clientes ao incluir um traffic
     */
    that.fillTableForSearchClient = () => {
        const table = z('table_clients')

        that.clients.forEach(el => {
            that.append(that.clients[el.id_client], 'table_clients')
        })
    }

     /**
     * Metodo realiza a alteração da tabela de pesquisa de clientes com um novo cliente criado
     * @param {object} client
     */
    that.append = (client, id) => {
        const table = z(id)
        const tr = document.createElement('tr')
        tr.setAttribute('id_client', client.id_client)
        
        const tdName = document.createElement('td')
        tdName.textContent = client.name
        
        const tdPhone = document.createElement('td')
        tdPhone.textContent = client.phone ? client.phone : ''

        tr.appendChild(tdName)
        tr.appendChild(tdPhone)

        table.appendChild(tr)
    }

    /**
     * Metodo invocado principalmente pelo traffic para atualizar os objetos na memoria
     * @param {object} client 
     */
    that.updateLocalObject = (client) => {
        config.cache.id_client = client.id_client
        
        if (!that.clients[client.id_client]) {
            that.clients[client.id_client] = new objClient(client)
            return that.append(that.clients[client.id_client], 'form_search_body')
        }

        that.clients[client.id_client].set(client)
    }

      /**
     * Metodo seleciona o cliente dentro de um search criado pelo formSearchClient
     * @param {event click} e 
     */
    that.selectUserFromSearch = (e) => {
        const id_client = e.target.parentNode.getAttribute('id_client')
        that.fillFormClient(id_client)
        
        z('form_search').style.display = 'none'
    }

      /**
     * Meodo realiza a pesquisa de clientes na memoria 
     * @param {event da digitação} e 
     */
    that.formSearchClient = e => {
        const val = e.target.value.toLowerCase()
        const table = z('form_search_body')
        const search = z('form_search')
        
        if (val.length === 0) {
            search.style.display = 'none'
            return false
        }
        
        search.style.display = 'table'
        
        let anyRegister = false
        const length = table.rows.length

        if (length === 0) return search.style.display = 'none'
                
        for (let i = 0; i < length ; i++) {
            const td = table.rows[i].cells[0].innerText;
            
            const isSimilar = td.toLowerCase().indexOf(val) >= 0;

            if (isSimilar) {
                anyRegister = true
                table.rows[i].style.display = ''
                continue
            }

            if (i === (length - 1) && anyRegister === false) {
                search.style.display = 'none'
            }

            table.rows[i].style.display = 'none'
        }
    }

     /**
     * Metodo responsavel por poreencher os dados do cliente no formulario do traffic e colocar a variavel no cache
     * @param {int} id_client 
     */
    that.fillFormClient = (id_client) => {
        config.cache.id_client = id_client

        config.form.name.value = that.clients[id_client].name
        config.form.phone.value = that.clients[id_client].phone
    }

    /**
     * Metodo realiza a pesquisa na tela de clientes
     */
    that.searchClientTable = e => {
        const val = e.target.value.toLowerCase()
        const table = z('table_clients')
        const length = table.rows.length
                
        for (let i = 0; i < length ; i++) {
            const td = table.rows[i].cells[0].innerText;
            const td2 = table.rows[i].cells[1].innerText;
            
            const isSimilar = td.toLowerCase().indexOf(val) >= 0;
            const isSimilar2 = td2.toLowerCase().indexOf(val) >= 0;

            if (isSimilar || isSimilar2) {
                table.rows[i].style.display = ''
                continue
            }

            table.rows[i].style.display = 'none'
        }
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
            that.fillTableForSearchTrafficClient()
            that.fillTableForSearchClient()
        })
    }

    that.editClient = () => {
        that.clients[config.cache.id_client].update({
            client: {
                id_client: config.cache.id_client,
                name: z('form_client_name').value.trim(),
                phone: z('form_client_phone').value.trim()
            }
        }, (response) => {
            if (response.status === false) {
                return bootbox.alert(response.err)
            }
            
            const tr = document.querySelector(`#table_clients tr[id_client="${config.cache.id_client}"]`)
            tr.childNodes[0].textContent = that.clients[config.cache.id_client].name
            tr.childNodes[1].textContent = that.clients[config.cache.id_client].phone
            
            bootbox.alert('Cliente atualizado com sucesso!')
        })
    }

    that.getEditClient = e => {
        const id_client = e.target.parentNode.getAttribute('id_client')
        const client = that.clients[id_client]
        
        z('form_client_name').value = client.name
        z('form_client_phone').value = client.phone

        config.cache.id_client = id_client
    }

    that.headerClients = () => {
        config.show('clients')
    }

      /**
     * Metodo construct
     */
    that.init = () => {
        that.getClientsToMemory()

        z('header_clients', that.headerClients)
        z('search_table_input', that.searchClientTable, 'input')
        z('form_client_save', that.editClient)
        z('table_clients', that.getEditClient)
        z('form_parking_name', that.formSearchClient, 'input')
        z('form_search_body', that.selectUserFromSearch)
        return that
    }

    return that.init()
}

loadMananger(() => {
    clientView = client()
})