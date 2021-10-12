/*
    debug.ts - Just for debug
 */
import {AWS, Client, Entity, Match, Table, print, dump, delay} from './utils/init'
import {DebugSchema} from './schemas'

jest.setTimeout(7200 * 1000)

const table = new Table({
    name: 'DebugTable',
    client: Client,
    schema: DebugSchema,
    uuid: 'ulid',
    logger: true,
})
const accountId = table.uuid()

test('Create Table', async() => {
    if (!(await table.exists())) {
        await table.createTable()
        expect(await table.exists()).toBe(true)
    }
})

type UserType = Entity<typeof DebugSchema.models.User>
let User = table.getModel<UserType>('User')
let user: UserType = null

test('Test', async() => {
    user = await User.update({
        email: 'rr@acme.com',
        slides: {
            '4SWys5q0BhHOiTxlRbBsK': {
                mediaType:  'video',
                mediaUrl:   'https://acme.com/',
                processed:  false,
            }
        }
    }, {exists: null})
    // dump("USER", user)

    user = await User.get({email: 'rr@acme.com'}, {hidden: true})
    user = await User.update({email: 'rr@acme.com'}, {set: {'slides.4SWys5q0BhHOiTxlRbBsK.processed': true}})
})

test('Destroy Table', async() => {
    await table.deleteTable('DeleteTableForever')
    expect(await table.exists()).toBe(false)
})
