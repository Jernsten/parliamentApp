import { isLogging, thisYear, buildHandlers } from "./scripts.js";

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
        logger('>> > sortMembersPerPartySize')

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

async function fetchData() {
    logger('>> > fetchData')

    const url = 'http://data.riksdagen.se/personlista/?utformat=json'

    const data = await fetch(url)
        .then(response => response.ok ? response.json() : Error('API response error'))
        .catch(async error => {
            logger(`>> > fetchParliamentData.catch, Error: ${error.message}`)

            // Use snapshot if API not responding
            return await fetch('json/data.json').then(localData => localData.json());
        })

    return data
}

export function logger(message) {
    isLogging && console.log(message)
}

function display(members) {
    logger('>> > display')

    members.forEach(member => {
        document.getElementById('parliamentList').appendChild(member.toListNode())
    })
}

export async function init() {
    logger('>> > init')

    // const parliamentData = await fetchParliamentData().then(data => { return data })
    // const gatherMembers = await createMembers(parliamentData)
    // const sortedMembers = await sortPerPartySize(gatherMembers)
    const data = await fetchData()
    const parliament = new Parliament(data)

    display(parliament.members)
    return true
}