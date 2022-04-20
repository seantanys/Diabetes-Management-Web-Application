// this file models a database table storing patient data

module.exports =
[
    {
        id: '10001',
        first_name: 'Alice',
        last_name: 'One',
        email: 'alice@mail.com',
        dob: '10/03/1994',
        bio: 'i like frogs.',
        username: 'alice1',
        bloodGluc: false,
        weight: true,
        exercise: true,
        insulin: false
    },
    {
        id: '10002',
        first_name: 'Bob',
        last_name: 'Two',
        email: 'bob@mail.com',
        dob: '12/03/1992',
        bio: 'i like monke.',
        username: 'bob1',
        bloodGluc: true,
        weight: true,
        exercise: true,
        insulin: true,
    },
    {
        id: '10003',
        first_name: 'John',
        last_name: 'Cena',
        email: 'john@mail.com',
        dob: '10/11/1982',
        bio: 'You cant see me',
        username: 'cena',
        bloodGluc: true,
        weight: true,
        exercise: false,
        insulin: false
    },
    {
        id: '10004',
        first_name: 'Zhong',
        last_name: 'Xina',
        email: 'zhong@mail.com',
        dob: '15/03/1982',
        bio: 'You can see me',
        username: 'xina',
        bloodGluc: false,
        weight: false,
        exercise: true,
        insulin: true
    }
]