import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true
export const thisYear = (() => { const date = new Date(); return date.getFullYear() })()

function hide(className) {
    logger(`>> > toggle, query = '${className}'`)

    const nodes = document.getElementsByClassName(className)
    logger(nodes)
    return () => {
        nodes.forEach(node => node.classList.toggle(className)
        )
    }
}

function buildListener(triggerId, className) {
    logger('>> > buildListener')

    const listener = document.getElementById(triggerId).addEventListener('change', hide(className))

    return listener
}

async function main() {
    logger('>> > main')

    await init()
    buildListener('hideMen', '.Man')
}


main()
