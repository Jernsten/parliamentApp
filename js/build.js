import { isLogging, thisYear } from "./scripts.js";

class Parliament {
    constructor(parliamentData) {
        logger('>> > Parliament.constructor')

        this.members = this.sortMembersPerPartySize(
            this.gatherMembers(parliamentData))
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
        this.name = `${firstName} ${lastName}`
        this.born = born
        this.age = thisYear - born
        this.gender = gender == 'man' ? 'man' : 'woman'
        this.party = party
        this.area = area
        this.imgUrl = imgUrl
    }

    toHTMLNode() {
        logger('> Member.toHTMLNode')

        // Create <li> node and set member details
        const li = document.createElement('li')
        li.classList.add('member', this.party, this.gender)
        li.setAttribute('data-age', this.age)
        li.setAttribute('data-gender', this.gender)
        li.setAttribute('data-imgUrl', this.imgUrl)

        // Create output <spans> with member details
        const spanList =
            [{ name: this.name },
            { party: this.party },
            { age: this.age },
            { gender: this.gender }]

        spanList.forEach(span => {
            let aSpanNode = document.createElement('span')
            let aSpanName = Object.getOwnPropertyNames(span)
            aSpanNode.classList.add(aSpanName)
            aSpanNode.innerText = span[aSpanName]
            li.appendChild(aSpanNode)
        })

        // attach image of member
        let img = document.createElement('img')
        img.setAttribute('src', this.imgUrl)
        li.appendChild(img)

        return li
    }
}

async function fetchData() {
    logger('>> > fetchData')

    const url = 'http://data.riksdagen.se/personlista/?utformat=json'

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

function display(members) {
    logger('>> > display')

    members.forEach(member => {
        document.getElementById('parliamentList').appendChild(member.toHTMLNode())
    })
}

export async function init() {
    logger('>> > init')

    const data = await fetchData()
    const parliament = new Parliament(data)

    display(parliament.members)
    return true
}
