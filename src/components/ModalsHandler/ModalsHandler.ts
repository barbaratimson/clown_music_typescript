

class ModalsHandler {
    modals: any[];
    constructor() {
        this.modals = []
    }

    public addModal(modal:any) {
        this.modals.push(modal)
        console.log(modal)
    }

    getAllModals() {
        return this.modals
    }
}

export default ModalsHandler
