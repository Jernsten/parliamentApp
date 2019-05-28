import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true
export const thisYear = (() => { const date = new Date(); return date.getFullYear() })()

export function buildHandlers() {
    logger('>> > buildHandlers')

    const menListener = document.querySelector('#hideMen').addEventListener('change', toggle('.men'))
    const womenListener = document.querySelector('#hideWomen').addEventListener('change', toggle('.women'))

    return [menListener, womenListener]
}

export function toggle(query) {
    logger(`>> > toggle, query = ${query}`)

    const membersToToggle = function () { document.getElementsByClassName(`member ${query}`).toggle('hide') }
    return membersToToggle
}

if (init()) {

}
