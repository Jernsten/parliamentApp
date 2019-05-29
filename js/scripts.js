import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true
export const thisYear = (() => { const date = new Date(); return date.getFullYear() })()

export function hide(query) {
    logger(`>> > toggle, query = '${query}'`)

    const node = document.getElementsByClassName(query)
    logger(node)
}

export function buildListeners(id, toggle) {
    logger('>> > buildListeners')

    const menListener = document.getElementById('hideMen').addEventListener('change', hide('.Man'))
    const womenListener = document.getElementById('hideWomen').addEventListener('change', hide('.Woman'))

    return [menListener, womenListener]
}

async function main() {
    await init() && buildListeners()
}

main()