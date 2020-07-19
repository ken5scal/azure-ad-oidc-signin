import Express from 'express';
import { AuthModule } from "./AuthModule";

const port = 3000
const host = 'localhost'
const clientId = '233198da-6ed2-40f0-8e65-1d235385e2fe'
const tenantId = '36a6e4b2-e620-44c2-897b-22b1d394354a'

const app = Express()
const path = require('path');
app.get('/', (req, res) => {
    // const msalInstance = new msal.PublicClientApplication(msalConfig);
    new AuthModule(clientId, tenantId)
    res.sendFile(path.join(__dirname + '/index.html'));
    // res.send(data)
})

app.listen(port, host, () => {
    console.log(`Running on http://${host}:${port}`)
})