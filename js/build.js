import { isLogging, thisYear, buildHandlers, toggle } from "./scripts.js";

export async function init() {
    logger('>> > init')

    const parliamentData = await fetchParliamentData().then(data => { return data })
    const gatherMembers = await createMembers(parliamentData)
    const sortedMembers = await sortPerPartySize(gatherMembers)

    display(sortedMembers)
    buildHandlers()
    return true
}

class Member {
    constructor(firstName, lastName, born, gender, party, area, imgUrl) {
        logger('>> > Member.constructor')
        this.name = `${firstName} ${lastName}`
        this.born = born
        this.age = thisYear - born
        this.gender = gender == 'man' ? 'Man' : 'Woman'
        this.party = party
        this.area = area
        this.imgUrl = imgUrl
    }

    toListNode() {
        logger('>> > Member.toListNode')

        const listNode = document.createElement('li')
        listNode.classList.add('member', this.party, this.gender, this.age)
        listNode.setAttribute('data-imgUrl', this.imgUrl)

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
            listNode.appendChild(aSpanNode)
        })

        return listNode
    }
}

export function logger(message) {
    isLogging && console.log(message)
}

async function fetchParliamentData() {
    logger('>> > fetchParliamentData')

    const url = 'json/data.json' // For production: url = 'http://data.riksdagen.se/personlista/?utformat=json'
    const json = await fetch(url)
        .then(response => { return response.json() })
        .catch(error => { logger(error.message) })

    return json
}

function createMembers(parliamentData) {
    logger('>> > createMembers')

    const membersData = parliamentData.personlista.person;
    const members = []

    membersData.forEach(person => {
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

function sortPerPartySize(memberArray) {
    logger('>> > sortPerPartySize')

    const partyOccurrences = {}

    // Count occurence of parties
    memberArray.forEach((member) => {
        !partyOccurrences[member.party] ?
            partyOccurrences[member.party] = 1 :
            partyOccurrences[member.party] += 1
    })

    const partiesSortedBySize = []

    for (let party in partyOccurrences) {
        partiesSortedBySize.push([party, partyOccurrences[party]])
    }

    partiesSortedBySize.sort((a, b) => { return b[1] - a[1] }) // Descending sort

    const sortedMemberArray = []

    partiesSortedBySize.forEach(party =>
        memberArray.forEach(member => {
            member.party == party[0] && sortedMemberArray.push(member)
        }))

    return sortedMemberArray
}


function display(membersArray) {
    logger('>> > display')

    membersArray.forEach(member => {
        document.getElementById('parliamentList').appendChild(member.toListNode())
    })
}
