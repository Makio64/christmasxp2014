self.addEventListener('message', receiveMessage);

THREAD = true;

function receiveMessage(e) {
    if (e.data.code) {
        self.eval(e.data.code);
        return;
    }
    
    if (e.data.importScript) {
        importScripts(e.data.path);
        return;
    }
    
    if (e.data.message.fn) {
        self[e.data.message.fn](e.data.message, e.data.id);
        return;
    }
    
    if (typeof receive !== 'undefined') {
        receive(e.data.message, e.data.id);
        return;
    }
}

function debug(message) {
    self.postMessage({console: true, message: message});
}

function post(data, id) {
    if (!(data && id)) {
        id = data;
        data = null;
    }

    self.postMessage({post: true, id: id, message: data});
}

function emit(evt, msg) {
    self.postMessage({emit: true, evt: evt, msg: msg});
}
