# codehooks-crudlify-yup
Create automatic CRUD API with schema and persistance for an Codehooks.io application.

## Install
```bash
npm i codehooks-crudlify-yup yup -s
```

## Code example
```js
/*
* Auto CRUD example using yup schema
*/
import { app } from 'codehooks-js'
import crudlify from 'crudlify-yup-schema';
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
