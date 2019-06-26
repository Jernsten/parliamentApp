import { init, logger } from './build.js'

// Turn on and off logging to console
export const isLogging = true

async function main() {
    logger('>> > main')

    const parliament = await init()

    if (parliament.members.length > 1) {
        await display(parliament.members)
    } else {
        console.log('Not going as planned here...')
    }
}

main()

async function display(members) {
    logger('>> > display')

    const parliamentList = document.getElementById('parliamentlist')
    members.forEach(member => {
        const memberLi = member.toHTMLNode()
        memberLi.addEventListener('click', showMore, false)
        parliamentList.appendChild(memberLi)
    })

    setupAgeSlider()
    attachSliderHandlers()

    return true
}


function setupAgeSlider() {
    logger('>> > setupAgeSlider')

    const slider = document.getElementById('ageslider')
    const gender = sessionStorage.getItem('gender')
    const members = [...document.getElementsByClassName('member')].filter(member => gender == 'both' || member.getAttribute('data-gender') == gender)
    slider.steps = [... new Set(members.map((member) => +member.getAttribute('data-age'))), 100].sort((a, b) => a - b) // 100 for 'show all ages'
    slider.max = slider.steps.length - 1
}

function attachSliderHandlers() {
    logger('>> > attachSliderHandlers')

    const ageSlider = document.getElementById('ageslider')
    ageSlider.oninput = function () {
        const age = this.steps[this.value]
        logger('>> > ageSlider ' + age + ' år')

        sessionStorage.setItem('age', age)

        const parliamentlist = document.getElementById('parliamentlist')
        this.value == this.max ? parliamentlist.classList.add('showallages') : parliamentlist.classList.remove('showallages')

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

        setupAgeSlider()
        update()
    }
}

function showMore(event) {
    logger('>> > showMore')

    // if a member was clicked (and not on negative space)
    if (event.target !== event.currentTarget) {
        logger(event.target)
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
}

function outputText() {
    logger('>> outputText')
    const age = sessionStorage.getItem('age')
    const gender = sessionStorage.getItem('gender')
    const sliderText = document.getElementById('slidertext')
    const showingMembers = [...document.getElementsByClassName('member')].filter(member => !member.classList.contains('hide'))
    const womanCount = showingMembers.filter(member => member.getAttribute('data-gender') == 'woman').length
    const manCount = showingMembers.filter(member => member.getAttribute('data-gender') == 'man').length
    let outputText = ''

    logger(womanCount + ' ' + manCount)

    switch (gender) {
        case 'woman':
            outputText += womanCount == 1 ? 'en kvinna ' : womanCount + ' kvinnor '
            break
        case 'both':
            if (womanCount > 0) {
                outputText += womanCount == 1 ? 'en kvinna ' : womanCount + ' kvinnor '
            }
            if (womanCount > 0 && manCount > 0) {
                outputText += ' och '
            }
            if (manCount > 0) {
                outputText += manCount == 1 ? 'en man ' : manCount + ' män '
            }
            break
        case 'man':
            outputText += manCount == 1 ? 'en man ' : manCount + ' män '
            break
    }

    if (age != 100) {
        outputText += 'som är ' + age + (womanCount + manCount == 1 ? ' år gammal' : ' år gamla')
    }

    sliderText.innerText = outputText
}