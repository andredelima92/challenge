/**
 * Usado para poupar tempo ao criar eventos e pegar inputs
 */
const z = (id, event, action = 'click') => {
    let doc = document.getElementById(id);

    if (doc && !event) return doc

    return doc.addEventListener(action, event)     
};

/**
 * @param {metodo para ser executado somente quando a pagina for carregada} callback 
 */
const loadMananger = (callback) => {
    return window.addEventListener('load', callback);
};
