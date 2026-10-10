export const request_ruleta = {
    saveSpinWheel: async (bodyWheel) => {
        const req = await fetch('http://localhost:3000/api/ruleta/Lanzamiento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyWheel)
        })

        const resp = await req.json();
        return resp;
    },

    getDateFromNewSpin: async (idCliente) => { 
        const req = await fetch(`http://localhost:3000/api/ruleta/ProximaTirada/${idCliente}`, {method: 'GET'});
        const resp = await req.json();
        return resp;
    }

}