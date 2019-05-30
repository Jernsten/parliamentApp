import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true
export const thisYear = (() => { const date = new Date(); return date.getFullYear() })()

async function main() {
    logger('>> > main')

    const initiatedSuccessfully = await init()

    initiatedSuccessfully ?                                      // IF ?
        attachListeners() && logger('OKOK Listeners attached') : // TRUE or:
        showErrorScreen() && logger('XXXX Failed to init')       // FALSE
}

main()

function attachListeners() {
    logger('>> > attachListeners')

    const ageSlider = document.getElementById('agerange')
    const genderSelector = document.getElementById('filtergender')

    ageSlider.onchange = function () {
        logger(`FLTR ageSlider ${this.value}`)
        document.getElementById('selectedage').innerText = this.value
        const members = [...document.getElementsByClassName('member')]

        for (let i = 0; i < members.length; i++) {
            const age = members[i].getAttribute('data-age')

            members[i].classList.contains('isolder') ?
                age <= this.value && members[i].classList.remove('isolder') :// if younger
                age > this.value && members[i].classList.add('isolder')     // if older
        }
    }

    genderSelector.onclick = function () {
        logger('FLTR genderSelector')

        switch (this.getAttribute('data-state')) {
            case 'showall':
                this.setAttribute('data-state', 'showwomen')
                break
            case 'showwomen':
                this.setAttribute('data-state', 'showmen')
                break
            case 'showmen':
                this.setAttribute('data-state', 'showall')
                break
        }

        genderFilter(this.getAttribute('data-state'))
    }

    function genderFilter(whatToShow) {
        logger('>> > genderFilter')
        const members = [...document.getElementsByClassName('member')]

        for (let i = 0; i < members.length; i++) {
            const gender = members[i].getAttribute('data-gender')

            showThis(gender) ?
                members[i].classList.remove('dontshowthisgender') :
                members[i].classList.add('dontshowthisgender')
        }

        function showThis(gender) {
            switch (whatToShow) {
                case 'showall':
                    return true
                case 'showwomen':
                    return gender == 'woman'
                case 'showmen':
                    return gender == 'man'
            }
        }
    }
}

function hide() { }