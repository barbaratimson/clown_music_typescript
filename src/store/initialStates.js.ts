import {ProgressT} from "../utils/types/types";

export const PlaylistInitState =  {uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{uri:""},available:true,owner:{uid:0,name:"",verified:false},kind:1}

export const SongInitState = {id:0,title:"",artists:[{id:0,cover:{uri:""},name:"",likesCount:0}],url:"",coverUri:"",chart:{bgColor:"",listeners:0,position:0,progress: "same" as ProgressT,shift:0}}