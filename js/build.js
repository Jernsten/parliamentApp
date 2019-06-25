import { isLogging } from "./scripts.js";

const thisYear = (() => { const date = new Date(); return date.getFullYear() })()

class Parliament {
    constructor(parliamentData) {
        logger('>> > Parliament.constructor')
        this.members = this.sortMembersPerPartySize(this.gatherMembers(parliamentData))
    }

    gatherMembers(parliamentData) {
        logger('>> > Parliament.gatherMembers')

        const members = []

        parliamentData.personlista.person.forEach(person => {
            members.push(new Member(
                person.tilltalsnamn,
                person.efternamn,
                person.fodd_ar,
                person.kon,
                person.parti,
                person.valkrets,
                person.bild_url_192,
            ))
        })
        return members
    }

    sortMembersPerPartySize(members) {
        logger('>> > Parliament.sortMembersPerPartySize')

        const partyCount = {}
        const partiesSortedBySize = []
        const sortedMemberArray = []

        // Count occurence of members per party
        members.forEach((member) => { !partyCount[member.party] ? partyCount[member.party] = 1 : partyCount[member.party] += 1 })
        // Push order to sort to array
        for (let party in partyCount) {
            partiesSortedBySize.push([party, partyCount[party]])
        }
        // Descending sort
        partiesSortedBySize.sort((a, b) => { return b[1] - a[1] })

        partiesSortedBySize.forEach(party =>
            members.forEach(member => {
                member.party == party[0] && sortedMemberArray.push(member)
            }))

        return sortedMemberArray
    }
}

class Member {
    constructor(firstName, lastName, born, gender, party, area, imgUrl) {
        logger('> Member.constructor')
        this.firstName = firstName
        this.fullName = `${firstName} ${lastName}`
        this.born = born
        this.age = thisYear - born
        this.gender = gender == 'man' ? 'man' : 'woman'
        this.party = party == '-' ? 'vilde' : party
        this.area = area
        this.imgUrl = imgUrl
    }

    toHTMLNode() {
        logger('> Member.toHTMLNode')

        const li = document.createElement('li')
        li.classList.add('member', this.party)
        li.setAttribute('data-age', this.age)
        li.setAttribute('data-gender', this.gender)

        const imgDiv = document.createElement('div')
        imgDiv.classList.add('img')
        imgDiv.style.backgroundImage = `url('${this.imgUrl.replace('http', 'https')}')`

        li.appendChild(imgDiv)

        const nameSpan = document.createElement('span')
        nameSpan.classList.add('name')
        nameSpan.innerText = this.firstName
        li.appendChild(nameSpan)

        const infoBox = this.createInfoBox()

        li.appendChild(infoBox)
        
        return li
    }

    createInfoBox() {
        const div = document.createElement('div')
        div.classList.add('infobox', 'hide')

        const spans = {
            name: this.fullName,
            born: this.born,
            area: this.area
        }

        for (let span in spans) {
            const aSpan = document.createElement('span')
            aSpan.classList.add(span)
            aSpan.innerText = spans[name]
            div.appendChild(aSpan)
        }

        return div
    }
}

async function fetchData() {
    logger('>> > fetchData')

    const url = 'https://data.riksdagen.se/personlista/?utformat=json'

    const data = await fetch(url)
        .then(response => response.ok ? response.json() : Error('XXXX API response error'))
        .catch(async error => {
            logger(`XXXX fetchParliamentData.catch, Error: ${error.message}`)

            return await fetch('json/snapshot.json').then(localSnapshot => localSnapshot.json());
        })
    return data
}

export function logger(message) {
    isLogging && console.log(message)
    return true
}

export async function init() {
    logger('>> > init')

    const data = await fetchData()
    const parliament = new Parliament(data)

    return parliament
}
