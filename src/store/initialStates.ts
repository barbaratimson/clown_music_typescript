import { UserT } from "../components/Pages/User/user.types";
import {ArtistT, CoverT, PlaylistT, ProgressT, TrackT} from "../utils/types/types";
import {ErrCodeT} from "./MessageSlice";
import {MessageType} from "./MessageSlice"

export const playerRepeatInit = localStorage.getItem("player_repeat") == "true"
export const playerShuffleInit = localStorage.getItem("player_shuffle") == "true"
export const PlaylistInitState =  {id:"", name:"", tracks:[],title:"",ogImage:"",description:"",cover:{id:"", type:""},owner:{id:0,name:"",verified:false},kind:1} as PlaylistT
export const MessageInitState= {message:"",code:200 as ErrCodeT,active:false, type: "error" as MessageType}
export const SongInitState = {id:0,title:"",artists:[],cover:{id:"",type:""}, genre:"", durationMs:0, uploadedBy: {id:0, name:""}, source:"", album:{id:0, artists:[], title:"",cover:{id:"",type:""}, genre:"",year:"",likesCount:0,tracks:[]}} as TrackT
export const HeaderInitState = {title:"",imgUrl:"",linkTo:"",active:false}
export const LikedSongsInitState = [{id:0,albumId:0}]
export const userInitialState:UserT = {id:0, username:"", isVerified:false}
