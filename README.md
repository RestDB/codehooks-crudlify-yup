# codehooks-crudlify-yup
Create automatic CRUD API with [Yup schema](https://www.npmjs.com/package/yup) and persistence for a [Codehooks.io](https://codehooks.io) application.
The package [query-to-mongo](https://www.npmjs.com/package/query-to-mongo) are used to convert REST API query parameters to MongoDB queries agains the Codehooks.io datastore engine.

**Example REST API with query:**

`https://myproject-ff00.api.codehooks.io/devstore/customers?name=john&age>21`

## Install
```bash
npm install yup codehooks-crudlify-yup codehooks-js
```

## Usage
```js
/*
* Auto CRUD example using yup schema
*/
import app from 'codehooks-js'
import crudlify from 'codehooks-crudlify-yup';
import * as yup from 'yup';

// yup schema customer
const customer =
    yup.object().shape({
        name: yup.string().required(),
        status: yup.string().required(),
        purchase: yup.number().required().positive().integer()
    })

// yup schema product
const product =
    yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required().positive().integer()
    })


// Add CRUD routes for collections (customer and product) with yup schema
crudlify(app, {customer, product});


// bind to serverless runtime
export default app.init();

```

## Automatic REST API
By using the `crudlify(app, schema)` function, your Codehooks.io app effectively gets a complete HTTP REST API with schema validation and data persistence.

Your Codehooks.io application will get these endpoints for any collection defined in your schema:

| Verb  | Codehooks.io route  | Description  |
|:---|---|---|
| `GET`  | https://{TENANT-ID}/{SPACE}/:collection  | Retrieve all objects (filtered by query)  |
| `GET`  | https://{TENANT-ID}/{SPACE}/:collection/:ID  | Retrieve object by ID  |
| `POST` | https://{TENANT-ID}/{SPACE}/:collection  | Add object  | 
| `PUT`  | https://{TENANT-ID}/{SPACE}/:collection/:ID  | Replace object by ID  | 
| `PATCH`  | https://{TENANT-ID}/{SPACE}/:collection/:ID  | Update object by ID  | 
| `PATCH`  | https://{TENANT-ID}/{SPACE}/:collection/*  | Update object(s) by query  | 
|`DELETE`| https://{TENANT-ID}/{SPACE}/:collection/:ID  | Delete object by ID  | 
|`DELETE`| https://{TENANT-ID}/{SPACE}/:collection/*  | Delete object(s) by query  | 

## Example API usage
The following examples shows how the CRUD API is used for a Codehooks.io application called `myproject-ff00` to access the data space `dev`.

```js
GET

https://myproject-ff00.api.codehooks.io/dev/customer?status=active&purchase>100

[
    {"name": "Jane", "status": "active", "purchase": 234, "_id": "18268179e4a-q3pz9of7st6kam"},
    {"name": "Joe", "status": "active", "purchase": 432, "_id": "182683fb57f-rzxrz7fdx1lrcd"}
]
```  

```js
GET

https://myproject-ff00.api.codehooks.io/dev/customer/18268179e4a-q3pz9of7st6kam

OUTPUT
{"name": "Jane", "status": "active", "purchase": 234, "_id": "18268179e4a-q3pz9of7st6kam"}
```  

```js
POST

https://myproject-ff00.api.codehooks.io/dev/customer

BODY
{"name": "Dave", "status": "active", "purchase": 0}
```  

```js
PUT

https://myproject-ff00.api.codehooks.io/dev/customer/18268fe12f5-51co7n8a40s2zp

BODY
{"purchase": 12}

OUTPUT
{
  "name": "Dave",
  "price": 12,
  "_id": "18268fe12f5-51co7n8a40s2zp"
}
```  

```js
DELETE

https://myproject-ff00.api.codehooks.io/dev/customer/18268fe12f5-51co7n8a40s2zp

OUTPUT
{
  "_id": "18268fe12f5-51co7n8a40s2zp"
}
```  

## Local development
You can also easily test out your app by [running it locally.](https://codehooks.io/docs/localdev)

Just replace the public project routes `https://myproject-ff00.api.codehooks.io` with `http://localhost:3000`.

E.g.

```js
POST

http://localhost:3000/dev/customer

BODY
{"name": "Dave", "status": "active", "purchase": 0}
```  

> A similar package using JSON Schema exists [here](https://www.npmjs.com/package/codehooks-crudlify-jsonschema)
