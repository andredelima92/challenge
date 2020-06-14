/**
 * Usado para poupar tempo ao criar eventos e pegar inputs
 */
const z = (id, event, action = 'click') => {
    let doc = document.getElementById(id);

    if (doc && !event) return doc

    try {
        doc.addEventListener(action, event)     
    } catch {
        return console.log(`${id} não existe`);
    }
};

/**
 * @param {metodo para ser executado somente quando a pagina for carregada} callback 
 */
const loadMananger = (callback) => {
    return window.addEventListener('load', callback);
};

let lib = () => {
    let that = {}

    that.formatDate = timestamp => {
        timestamp = new Date(timestamp)
        let newDate = timestamp.getDate()

        newDate += '-' + timestamp.getMonth()
        newDate += '-' + timestamp.getFullYear()
        newDate += '  ' + timestamp.getHours()
        newDate += ':' + timestamp.getMinutes()
        newDate += ':' + timestamp.getSeconds()

        return newDate
    }

    that.ajax = (params, callback, before) => {
        params.ts = parseInt((new Date().getTime() /1000).toFixed(0))

        if (!params.s || !params.a || !params.type) {
            return alert('Voce tentou invocar um ajax sem informar os parametros corretos')
        }

        if (!window.XMLHttpRequest) {
            return false;
        }
        
        if (before) {
            before()
        }
       
        let obj = new XMLHttpRequest();

        let url = ''
        
        if (params.type === 'GET') {
            url +=  'data=' + JSON.stringify(params);
        }

        obj.open(params.type, `http://127.0.0.1/challenge/php/query.php?${url}`, true);
        
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        obj.send('data=' + JSON.stringify(params));  

        obj.onreadystatechange = () => {
            if (obj.readyState == 4 && obj.status == 200) {
                let data = obj.response
                data = JSON.parse(data)

                callback && callback(data)
            }
        }
    }

    that.init = () => {
        return that
    }

    return that.init()
}

window.addEventListener('load', () => {   
    lib = lib()
})