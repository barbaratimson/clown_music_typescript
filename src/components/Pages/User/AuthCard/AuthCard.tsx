import { Check, Close } from "@mui/icons-material"
import Loader from "../../../Loader"
import { UserT } from "../user.types"
import './style.scss'

type ServiceT = "YandexMusic" | "VkMusic"

type AuthCardStatusT = "loading" | "failed" | "success"

interface AuthCardProps {
    user: UserT,
    service: ServiceT
    status: AuthCardStatusT
}
const AuthCard = ({user,service,status}:AuthCardProps) => {

    const formatStatusReturn = (status:AuthCardStatusT) => {
        switch(status) {
            case "loading": {
                return <Loader size={14}/>
            }
            case "failed": {
                return <Close htmlColor="red"/>
            }
            case "success": {
                return <Check htmlColor="green"/>
            }
        }
    }

    const formatServiceReturn = (service:ServiceT) => {
        switch (service) {
            case "YandexMusic": {
                return <img src="https://avatars.mds.yandex.net/get-socsnippets/10241295/2a000001914968a454378aa2a57454ff0dbf/square_83" alt=""/>
            }
            case "VkMusic": {
                return
            }
        }
    }

    return (
        <div className="auth-card__wrapper">
            <div className="auth-card__service-logo">{formatServiceReturn(service)}</div>
            <div className="auth-card__user-account-name">{user.account?.displayName}</div>
            <div className="auth-card__status">
                {formatStatusReturn(status)}
            </div>
        </div>
    )
}

export default AuthCard