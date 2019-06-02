import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true

async function main() {
    logger('>> > main')

    const parliament = await init()

    if (parliament.members.length > 1) {
        display(parliament.members)
        setupSlider()
        attachEventHandlers()
    } else {
        logger('Not going as planned here...')
    }
}

main()

function display(members) {
    logger('>> > display')

    members.forEach(member => {
        document.getElementById('parliamentlist').appendChild(member.toHTMLNode())
    })
}


function setupSlider() {
    logger('>> > setupSlider')

    const slider = document.getElementById('ageslider')
    const gender = sessionStorage.getItem('gender')
    const members = [...document.getElementsByClassName('member')].filter(member => gender == 'both' || member.getAttribute('data-gender') == gender )
    slider.steps = [... new Set(members.map((member) => +member.getAttribute('data-age'))), 100].sort((a, b) => a - b) // 100 for 'show all ages'
    slider.max = slider.steps.length - 1
}

function attachEventHandlers() {
    logger('>> > attachEventHandlers')

    const ageSlider = document.getElementById('ageslider')
    ageSlider.oninput = function () {
        logger('>> > ageSlider ' + ageSlider.steps[this.value] + ' år')

        sessionStorage.setItem('age', ageSlider.steps[this.value])

        update()
    }

    const genderSlider = document.getElementById('genderslider')
    sessionStorage.setItem('gender', 'both')
    genderSlider.oninput = function () {
        logger('FILTER gender: ' + this.value)
        switch (this.value) {
            case '0':
                sessionStorage.setItem('gender', 'woman')
                break
            case '1':
                sessionStorage.setItem('gender', 'both')
                break
            case '2':
                sessionStorage.setItem('gender', 'man')
        }

        update()
    }
}

function update() {
    logger('>> update')
    const age = sessionStorage.getItem('age')
    const gender = sessionStorage.getItem('gender')
    const members = [...document.getElementsByClassName('member')]

    logger('FILTER ' + age + ' ' + gender + '     >>>>>>>>>>>')

    // Show or hide members
    members.forEach(member => {
        if ((age == 100 || member.getAttribute('data-age') == age) &&
            (gender == 'both' || member.getAttribute('data-gender') == gender)) {
            member.classList.remove('hide')
        } else {
            member.classList.add('hide')
        }
    })

    outputText()
    setupSlider()
}

function outputText() {
    logger('>> outputText')
    const notHiddenMembers = [...document.getElementsByClassName('member')].filter(member => !member.classList.contains('hide'))
    const allaEllerEn = document.getElementById('allaelleren')
    const selectedAge = document.getElementById('selectedage')
    const selectedGender = document.getElementById('selectedgender')

    const membersCount = notHiddenMembers.length
    allaEllerEn.innerText = membersCount == 0 ? 'Inga ' : membersCount == 1 ? 'En ' : 'Alla '
    selectedAge.innerText = sessionStorage.getItem('age') == 100 ? '' : sessionStorage.getItem('age') + (notHiddenMembers.length == 1 ? '-årig ' : '-åriga ')

    const gendersOfNotHiddenMembers = notHiddenMembers.map(member => member.getAttribute('data-gender'))
    if (gendersOfNotHiddenMembers.length == 1) {
        selectedGender.innerText = gendersOfNotHiddenMembers[0] == 'woman' ? 'kvinna' : 'man'
    } else if ([...new Set(gendersOfNotHiddenMembers)].length == 1) {
        selectedGender.innerText = gendersOfNotHiddenMembers[0] == 'woman' ? 'kvinnor' : 'män'
    } else {
        selectedGender.innerText = 'kvinnor och män'
    }
}