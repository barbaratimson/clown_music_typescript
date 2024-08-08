import { useEffect } from "react"
import { RootState, useAppSelector } from "../../store"

const DevLog = () => {
    const devLog = useAppSelector((state:RootState) => state.devLog.log)

    useEffect(()=>{
        console.log(devLog)
    },[])
    
    return (
        <textarea className="devLog" value={devLog}></textarea>
    )
}

export default DevLog