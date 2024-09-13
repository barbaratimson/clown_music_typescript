import { render } from "@testing-library/react"
import SeekSlider from "."

describe('Seek slider', ()=>{
    test('is rendered', async ()=>{
       render(<SeekSlider loadingState={false} position={0} duration={0} changeTime={function (value: number): void {
           throw new Error("Function not implemented.")
       } }/>)
    })
})