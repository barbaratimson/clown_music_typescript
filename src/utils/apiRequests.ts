
import axios from "axios";

const link = process.env.REACT_APP_YMAPI_LINK


export const fetchYaSongLink = async (id:string | number) => {
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};