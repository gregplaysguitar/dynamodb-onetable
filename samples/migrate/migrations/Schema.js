/*
    Migration sample schema
*/

/*
    A few validation regular expressions
 */
const Match = {
    email:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    name:   /^[a-z0-9 ,.'-]+$/i,
    address: /[a-z0-9 ,.-]+$/,
    zip:    /^\d{5}(?:[-\s]\d{4})?$/,
    phone:  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
    ulid:   /^[0-9A-Z]{26}$/i,
    uuid:   /^[0-9A-F]{32}$/i,

}

export default {
    indexes: {
        primary: { hash: 'pk', sort: 'sk' },
        gs1:     { hash: 'gs1pk', sort: 'gs1sk', project: ['gs1pk', 'gs1sk'] },
    },
    models: {

        Account: {
            pk:         { type: String, value: 'account#${id}' },
            sk:         { type: String, value: 'account#' },
            id:         { type: String, uuid: true, validate: Match.uuid },
            name:       { type: String, required: true, unique: true, validate: Match.name },
            balance:    { type: Number, default: 0 },

            //  Search by account name or by type
            gs1pk:      { type: String, value: 'account#' },
            gs1sk:      { type: String, value: 'account#${name}${id}' },
        },

        User: {
            pk:         { type: String, value: 'account#${accountId}' },
            sk:         { type: String, value: 'user#${email}' },
            accountId:  { type: String, required: true },
            id:         { type: String, uuid: true, validate: Match.uuid },
            name:       { type: String, required: true, validate: Match.name },
            email:      { type: String, required: true, validate: Match.email },

            address:    { type: Object, default: {}, schema: {
                street: { type: String, /* map: 'data.street' */ },
                city:   { type: String, /* map: 'data.city' */ },
                zip:    { type: String, /* map: 'data.zip' */ },
            } },

            balance:    { type: Number, default: 0 },
            status:     { type: String, required: true, default: 'active', enum: ['active', 'inactive'] },

            //  Search by user name or by type
            gs1pk:      { type: String, value: 'user#' },
            gs1sk:      { type: String, value: 'user#${name}#${id}' },
        },

        Product: {
            pk:         { type: String, value: 'product#${id}' },
            sk:         { type: String, value: 'product#' },
            id:         { type: String, uuid: true, validate: Match.uuid },
            name:       { type: String, required: true },
            price:      { type: Number, required: true },

            //  Search by product name or by type
            gs1pk:      { type: String, value: 'product#' },
            gs1sk:      { type: String, value: 'product#${name}#${id}' },
        },

        Invoice: {
            pk:         { type: String, value: 'account#${accountId}' },
            sk:         { type: String, value: 'invoice#${id}' },

            accountId:  { type: String, required: true },
            date:       { type: Date, default: () => new Date() },
            id:         { type: String, uuid: true },
            product:    { type: String },
            count:      { type: Number },
            total:      { type: Number },

            //  Search by invoice date or by type
            gs1pk:      { type: String, value: 'invoice#' },
            gs1sk:      { type: String, value: 'invoice#${date}#${id}' },
        }
    }
}
