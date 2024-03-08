

export const getImageLink = (link:string,size:string) => {
    if (!link) return "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"
    return `http://${link.substring(0, link.lastIndexOf('/'))}/${size}`
}
