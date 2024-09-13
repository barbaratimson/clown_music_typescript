import { UserT } from "../components/Pages/User/user.types";
import {ProgressT} from "../utils/types/types";
import {ErrCodeT} from "./MessageSlice";
import {MessageType} from "./MessageSlice"

export const playerRepeatInit = localStorage.getItem("player_repeat") == "true"
export const playerShuffleInit = localStorage.getItem("player_shuffle") == "true"
export const PlaylistInitState =  {uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{uri:""},available:true,owner:{uid:0,name:"",verified:false},kind:1}
export const MessageInitState= {message:"",code:200 as ErrCodeT,active:false, type: "error" as MessageType}
export const SongInitState = {id:0,title:"",artists:[],url:"",coverUri:"",chart:{bgColor:"",listeners:0,position:0,progress: "same" as ProgressT,shift:0},available: true, durationMs:0,albums:[]}
export const HeaderInitState = {title:"",imgUrl:"",linkTo:"",active:false}
export const LikedSongsInitState = [{id:0,albumId:0}]
export const userInitialState:UserT = {account:{uid:0,firstName:"",secondName:"",registeredAt:"",login:"",displayName:""}}