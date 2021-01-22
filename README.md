# Cypress test suite for Openstad Integration test

See docs.openstad.amsterdam for more info about type of sites.

We are currently testing setting up integration tests for our the following sites:

### Budgeting site
This is a participatory budgetting site in voting phase, where users need a voting code to be able to vote.

### Submitting ideas site
This is a site where users can sumbit their ideas

### Voting site
A small site where users can vote on ideas with their e-mail

### Admin panel
Much more settings and combinations of sites are available in the Openstad system, these will be added step by step.

## Getting started

### Run npm install

Run npm install in the root of the openstad cypress repo.
```
npm i
```

### Install Cypress
Easiest way is to install cypress globally, run the following:

```
npm i cypress -g
```

Cypress allows for opening tests in a browsers environment where the tests are observable, and after the automated test it's possible to manually test. This is done as follows:

```
cypress open
```

To run all tests in command line or
```
cypress run
```

See cypress.com for more details

### Setting up environment values
See example.cypress.env.json for values that are being used. Rename this file to cypress.env.json.
Now it should be possible to open, or run cypress

| Env value  | Description |
|---|---|
| votingSiteUrl | (string) Url for a voting site, based on dummy in admin panel  |
| submittingSiteUrl  | (string) Url for a submitting ideas site, based on dummy in admin panel   |
| budgettingSiteUrl  | (string) Url for a participatory budgetting  site, based on dummy in admin panel    |
| budgettingSiteId  |  (integer) Site ID participatory budgetting  site  |
| adminUrl  | (string) url for the admin panel |
| usePasswordLogin  | (boolean) If using password or e-mail authentication, password is stable, e-mail authentication has issues if sending is delayed, current tests expect that multiple authentication methods are expected, in client table should be set as following: authTypes: ['Local', 'Url'] |
| mailSlurpApiKey  | For authentication via e-mail Mailslurp is used, api key is generated at mailslurp.com  |
| defaultUserEmail  | E-mail address for a normal user, test expect required fields like firstname and lastname filled  |
| defaultUserMailSlurpInboxId  | E-mail inbox id, found at mailslurp.com  |
| userPassword  | Password for defaultUser, if password auth is used  |
| moderatorUserEmail  |   E-mail address for a moderator user, test expect required fields like firstname and lastname filled  |
| moderatorUserMailSlurpInboxId  | E-mail inbox id, found at mailslurp.com |
| adminUserEmail  | E  |
| adminUserMailSlurpInboxId  |   |
| adminPassword  | Password for adminUser, if password auth is used   |
| trustedEmailDomain  | Domain used for sending emails to random user,   |
| senderEmail  | E-mailaddress for sending e-mail when creating a site  |

## Running tests for different environments
In order to be able to test different environments we have staging and acc scripts in package.json loading in different config.
Cypress allowe

The following scripts present in package.json makes it possible to easily run and open tests for different both staging and acc environments.

```
"open:staging": "cypress open --config-file config/staging.json",
"run:staging:subdir": "cypress run --config-file config/staging-subdir.json",
"open:staging:subdir": "cypress open --config-file config/staging-subdir.json",
"run:staging": "cypress run --config-file config/staging.json",
"open:acc": "cypress open --config-file config/acc.json",
"run:acc": "cypress run --config-file config/acc.json",
"open:acc:subdir": "cypress open --config-file config/acc-subdir.json",
"run:acc:subdir": "cypress run --config-file config/acc-subdir.json"
```

So for instance make sure a config/staging.json is present, and run :
```
npm run open:staging
```
and for acc  make sure a config/acc.json is present, and run :
```
npm run open:acc
```
