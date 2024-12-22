import {render, screen} from "@testing-library/react";
import Loader from "./index";


describe('Loader', ()=>{
    test('rendered', async ()=>{
        render(<Loader/>)
        const container = document.getElementsByClassName('loader-wrapper')[0]
        expect(container).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
    test('size working', async ()=>{
        render(<Loader size={50}/>)
        expect(screen.getByRole('progressbar')).toHaveStyle("width:50px")
    })
})

describe('Page Loader', ()=>{
    test('rendered', async ()=>{
        render(<Loader.PageLoader/>)
        const container = document.getElementsByClassName('page')[0]
        expect(container).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
    test('size working', async ()=>{
        render(<Loader.PageLoader size={50}/>)
        expect(screen.getByRole('progressbar')).toHaveStyle("width:50px")
    })
})