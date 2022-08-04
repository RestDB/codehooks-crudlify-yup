import q2m  from 'query-to-mongo';

let _schema = {};
let _opt = {};

/**
 * 
 * @param {object} app - Codehooks app ( npm package codehooks-js)
 * @param {object} schema - Yup schema object
 * @param {object} opt - Options for strict
 */
export default function crudlify(app, schema={}, opt={strict:true}) {
    _schema = schema;
    _opt = opt;
    // Codehooks API routes
    app.post('/:collection', createFunc);
    app.get('/:collection', readManyFunc);
    app.get('/:collection/:ID', readOneFunc);   
    app.put('/:collection/:ID', updateFunc);
    app.delete('/:collection/:ID', deleteFunc);
}

async function createFunc(req, res) {
    const {collection} = req.params;
    let document = req.body;
    if (_schema[collection]) {
        _schema[collection].validate(document).then( async function(value) {
            document = _schema[collection].cast(value)
            console.log(document)
            const conn = await Datastore.open();
            const result = await conn.insertOne(collection, document);  
            res.json(result);
          })
          .catch(function (err) {
            console.log(document, err)
            res.status(400).json(err);
          }); 
    } else {
        if (_opt.strict) {
            return res.status(400).json({"error": `Schema required for ${collection}`});
        } else {
            console.log("No schema for", collection)
        }        
    }
}


async function readManyFunc(req, res) {
    const {collection} = req.params;
    if (_opt.strict && !_schema[collection]) {
        return res.status(404).send(`No collection ${collection}`)
    }
    const conn = await Datastore.open();
    const options = {
        filter: q2m(req.query).criteria
    }
    conn.getMany(collection, options).json(res);  
}

async function readOneFunc(req, res) {
    const {collection, ID} = req.params;
    const conn = await Datastore.open();    
    try {
        if (_opt.strict && !_schema[collection]) {
            throw `No collection ${collection}`
        }
        const result = await conn.getOne(collection, ID);
        res.json(result);
    } catch (e) {
        res
        .status(404) // not found
        .end(e);
    }
}

async function updateFunc(req, res) {
    const {collection, ID} = req.params;
    try {
        const document = req.body;
        const conn = await Datastore.open();  
        const result = await conn.updateOne(collection, ID, document, {}); 
        res.json(result);   
    } catch (e) {
        res
        .status(404) // not found
        .end(e);
    }
}

async function deleteFunc(req, res) {
    const {collection, ID} = req.params;
    try {
        const conn = await Datastore.open();  
        const result = await conn.removeOne(collection, ID, {}); 
        res.json(result);    
    } catch (e) {
        res
        .status(404) // not found
        .end(e);
    }
}