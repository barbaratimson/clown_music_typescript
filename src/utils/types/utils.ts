

export const getImageLink = (link:string,size:string) => {
    return `http://${link.substring(0, link.lastIndexOf('/'))}/${size}`
}