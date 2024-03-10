

export const getImageLink = (link:string,size:string) => {
    if (!link) return undefined
    return `http://${link.substring(0, link.lastIndexOf('/'))}/${size}`
}
