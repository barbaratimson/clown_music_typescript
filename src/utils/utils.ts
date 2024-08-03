export function addAlpha(color:string, opacity:number) {
    var _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

export const getImageLink = (link:string | undefined,size:string) => {
    if (!link) return undefined
    return `http://${link.substring(0, link.lastIndexOf('/'))}/${size}`
}

export function secToMinutesAndSeconds(time:number | undefined) {
    if (time){
        const minutes = Math.trunc(time / 60);
        const seconds = Math.trunc(time - minutes * 60);
        return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
    } else {
        return '0:00'
    }
}

export function isElementInViewport (el:HTMLElement) {
    let rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function msToMinutesAndSeconds(time:number | undefined) {
    if (time){
        const minutes = Math.floor(time / 60000);
        const seconds = Number(((time % 60000) / 1000).toFixed(0));
        return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
    } else {
        return '0:00'
    }
}