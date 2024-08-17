const breakpoints = {
    mobile: 599
}

export interface uiStateT {
    ui:{
        width:number
    }
}

export const deviceState:uiStateT = {
    ui: {
        width: 0
    }
}

export const handleSubscribe = () => {
    deviceState.ui.width = window.innerWidth
}

export const onSubscribe = () => {
    window.addEventListener('resize', handleSubscribe)
}

export const offSubscribe = () =>
    window.removeEventListener('resize', handleSubscribe)

export const getIsMobile = (state: uiStateT) => {
    return state.ui.width <= breakpoints.mobile;
}

export const getIsDesktop = (state:uiStateT) => !getIsMobile(state)

export const getIsMobileInfo = () => {
    handleSubscribe()
    onSubscribe()
    return getIsMobile(deviceState)
}