import {render, screen} from "@testing-library/react";
import Loader from "./index";


describe('Render Loader', ()=>{
    test('is loader rendered', async ()=>{
        render(<Loader/>)
        const container = document.getElementsByClassName('loader-wrapper')[0]
        expect(container).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
    test('is size working', async ()=>{
        render(<Loader size={50}/>)
        expect(screen.getByRole('progressbar')).toHaveStyle("width:50px")
    })
})

describe('Render Page Loader', ()=>{
    test('is page loader rendered', async ()=>{
        render(<Loader.PageLoader/>)
        const container = document.getElementsByClassName('page')[0]
        expect(container).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
    test('is size working', async ()=>{
        render(<Loader.PageLoader size={50}/>)
        expect(screen.getByRole('progressbar')).toHaveStyle("width:50px")
    })
})