# codehooks-crudlify-yup
Create automatic CRUD API with schema and persistence for a Codehooks.io application.

## Install
```bash
npm install codehooks-crudlify-yup
npm install codehooks-js
npm install
```

## Code example
```js
/*
* Auto CRUD example using yup schema
*/
import app from 'codehooks-js'
import crudlify from 'codehooks-crudlify-yup';
import * as yup from 'yup';

// yup schema per collection
let schema = {
    "customer":
        yup.object().shape({
            name: yup.string().required(),
            age: yup.number().required().positive().integer()
        }),
    "product":
        yup.object().shape({
            name: yup.string().required(),
            price: yup.number().required().positive().integer()
        })
}

// Add CRUD routes with yup schema
crudlify(app, schema);

// bind to serverless runtime
export default app.init();

```

## Automatic REST API
Using the `crudlify(app, schema)` function effectively adds a complete HTTP/2 REST API with schema validation and data persistence to any Codehooks.io application.

Your Codehooks.io application will get these endpoints for any collection defined in your schema:

| Verb  | Codehooks.io route  | Description  | Example endpoint  |
|---|---|---|---|
| `GET`  | https://{TENANT-ID}/{SPACE}/:collection  | Retrieve objects from a collection  | https://myproject-ff00/dev/customer  |
| `GET`  | https://{TENANT-ID}/{SPACE}/:collection/:ID  | Retrieve object by ID from a collection  | https://myproject-ff00/dev/customer/1826817743c-6b11t89gws82a0  |
| `POST` | https://{TENANT-ID}/{SPACE}/:collection  | Add object(s) to a collection  | https://myproject-ff00/dev/customer  |
| `PUT`  | https://{TENANT-ID}/{SPACE}/:collection/:ID  | Update object by ID in a collection  | https://myproject-ff00/dev/customer/1826817743c-6b11t89gws82a0  |
|`DELETE`| https://{TENANT-ID}/{SPACE}/:collection/:ID  | Delete object by ID in a collection  | https://myproject-ff00/dev/customer/1826817743c-6b11t89gws82a0  |

