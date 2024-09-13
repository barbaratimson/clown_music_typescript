import { render } from "@testing-library/react"
import PlayButton from "."

describe('Play button', ()=>{
    test('is rendered', async ()=>{
        render(<PlayButton playing={false} startFunc={()=>{}} stopFunc={()=>{}} onKeyDown={()=>{}}/>)
    })
})