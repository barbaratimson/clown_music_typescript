import { UserT } from "../components/Pages/User/user.types";
import {ProgressT, TrackT} from "../utils/types/types";
import {ErrCodeT} from "./MessageSlice";
import {MessageType} from "./MessageSlice"

export const playerRepeatInit = localStorage.getItem("player_repeat") == "true"
export const playerShuffleInit = localStorage.getItem("player_shuffle") == "true"
export const PlaylistInitState =  {uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{id:"", type:""},owner:{uid:0,name:"",verified:false},kind:1}
export const MessageInitState= {message:"",code:200 as ErrCodeT,active:false, type: "error" as MessageType}
export const SongInitState = {id:0,title:"",artists:[],url:"",cover:{id:"",type:""}, genre:"", durationMs:0,albums:[]} as TrackT
export const HeaderInitState = {title:"",imgUrl:"",linkTo:"",active:false}
export const LikedSongsInitState = [{id:0,albumId:0}]
export const userInitialState:UserT = {account:{uid:0,firstName:"",secondName:"",registeredAt:"",login:"",displayName:""}}