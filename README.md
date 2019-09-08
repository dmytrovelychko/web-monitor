[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Description

Web monitor node app

## For development

##### How to setup https for localhost?

1. Create root CA private key to generate root CA certificate
   (chrome will claim about common name property in certificate if you will try to use only it for auth)
     
    `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout rootCA.key -out rootCA.pem`

2. Set root certificate as trusted in browser (or keychain in mac)

3. For proper work in Chrome need to issue domain certificate with `subjectAltName` property by root certificate

    3.1 Create server private key, using configs from `./https/config/server.csr.cnf`

    `openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )`

    3.2 Create domain certificate signed with root certificate using config from `./https/configv3.ext`

    `openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext`

    3.3 Move `server.crt` and `server.key` to `./https/server-options`

    [source](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/)
