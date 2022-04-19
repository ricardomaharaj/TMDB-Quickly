import { STAR } from './consts'

export function renderStars(average?: number) {
    return <div className='row mt-1 space-x-1'>
        {new Array(parseInt((average! / 2).toString()!)).fill(STAR).map((x, i) => { return <span key={i}> {x} </span> })}
    </div>
}
