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

    ageRange()
    const ageSlider = document.getElementById('agerange')
    ageSlider.setAttribute('max', ageRange.maxSliderValue)

    ageSlider.oninput = function () {
        const selection = ageRange.sliderPositions[this.value]
        logger(`FLTR ageSlider ${selection}`)

        // output age selection
        const ageOutput = selection == 100 ? 'Alla' : `${selection} åriga`
        document.getElementById('selectedage').innerText = ageOutput

        // show members of selected age
        const members = [...document.getElementsByClassName('member')]

        for (let i = 0; i < members.length; i++) {
            const age = Number(members[i].getAttribute('data-age'))

            switch (Number(selection)) {
                case 100:
                case age:
                    members[i].classList.remove('wrongage')
                    break
                default:
                    members[i].classList.add('wrongage')
                    break
            }
        }

        checkForSingles() // Check if only one member showing
    }

    function ageRange() {
        logger('>> > ageRange')

        const members = [...document.getElementsByClassName('member')]

        ageRange.sliderPositions = [... new Set(members.map(member => Number(member.getAttribute('data-age')))),
            100].sort((one, theNext) => one - theNext)

        ageRange.maxSliderValue = ageRange.sliderPositions.length - 1
    }

    const genderSlider = document.getElementById('showgender')

    genderSlider.oninput = function () {
        logger('FLTR genderSlider')

        switch (this.value) {
            case '0': // show only women
                genderSelectionOutput('kvinnor')
                genderFilter('showWomen')
                break
            case '1': // show both
                genderSelectionOutput('kvinnor och män')
                genderFilter('showBoth')
                break
            case '2': // show only men
                genderSelectionOutput('män')
                genderFilter('showMen')
                break
        }
        checkForSingles() // Check if only one member showing
    }

    function genderSelectionOutput(selection) {
        logger('>> > genderSelectionOutput')

        document.getElementById('selectedgender').innerText = selection
    }

    function genderFilter(whatToShow) {
        logger('>> > genderFilter')
        const members = [...document.getElementsByClassName('member')]

        for (let i = 0; i < members.length; i++) {
            const member = members[i].getAttribute('data-gender')

            showThis(member, whatToShow) ?
                members[i].classList.remove('dontshowthisgender') :
                members[i].classList.add('dontshowthisgender')
        }

    }

    function showThis(member, whatToShow) {
        switch (whatToShow) {
            case 'showWomen':
                return member == 'woman'
            case 'showBoth':
                return true
            case 'showMen':
                return member == 'man'
        }
    }

    function checkForSingles() {
        logger('>> checkForSingles ')

        const showingMembers = [...document.getElementsByClassName('member')]
            .filter(member => !(member.classList.contains('dontshowthisgender') ||
                member.classList.contains('wrongage')))

        logger(showingMembers.length)

        if (showingMembers.length == 1) {
            logger('yolo')
            switch (showingMembers[0].getAttribute('data-gender')) {
                case 'man':
                    genderSelectionOutput('man')
                    break
                case 'woman':
                    genderSelectionOutput('kvinna')
                    break
            }
        }
    }


}