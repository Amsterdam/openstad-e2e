# Cypress test suite for Openstad Integration test

See https://docs.openstad.amsterdam/ for more info about Openstad and it's features.

This suite currently contains end to end tests for  the following type of sites running on Openstad:

### Budgeting site
This is a participatory budgetting site in voting phase, where users need a voting code to be able to vote.
Tests cover voting, creating voting codes etc.

### Submitting ideas site
This is a site where users can submit their ideas. Tests cover submitting ideas, validating, displaying, editing etc.

### Voting site
This is a voting site where users can vote on one idea by authenticating with their e-mail.

### Interactive map site
This is a site where users can submit their ideas on a map.

### Admin panel
The admin panels allows for creating, editing, and deleting sites. Tests in this suite test the general create, read, delete and update of the site.
As well as testing the updating of more complicated settings like changing a URL, which involves different servers and correct host settings.

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

Cypress allows for opening tests in a browsers environment where the tests are observable, and after the automated test it's possible to manually test. This is done as follows (make sure environemnt values are probably set ty):

```
cypress open
```

To run all tests in command line or
```
cypress run
```

See https://docs.cypress.io/ for more details on what's possible with Cypress.

### Setting up environment values
See example.cypress.env.json for values that are being used. Rename this file to cypress.env.json. Also possible to set up more config files, see below for more info for how it's set up currenty

| Key  | Description |
|---|---|
| votingSiteUrl |  Url for a voting site, based on dummy in admin panel  |
| submittingSiteUrl  | Url for a submitting ideas site, based on dummy in admin panel   |
| budgettingSiteUrl  | Url for a participatory budgetting  site, based on dummy in admin panel    |
| budgettingSiteId  |  Site ID participatory budgetting  site  |
| mapSiteUrl | Url for an interactive map site. There is no dummy in the admin panel yet. The interactive map widget should be on the /kaart page. |
| adminUrl  | url for the admin panel |
| usePasswordLogin  | (boolean) If using password or e-mail authentication, password is stable, e-mail authentication has issues if sending is delayed, current tests expect that multiple authentication methods are expected, in client table should be set as following: authTypes: ['Local', 'Url']. |
| mailSlurpApiKey  | For authentication via e-mail Mailslurp is used, api key is generated at mailslurp.com  |
| defaultUserEmail  | E-mail address for a normal user, test expect required fields like firstname and lastname filled  |
| defaultUserMailSlurpInboxId  | E-mail inbox id, found at mailslurp.com  |
| userPassword  | Password for defaultUser
| moderatorUserEmail  |   E-mail address for a moderator user, test expect required fields like firstname and lastname filled  |
| moderatorUserMailSlurpInboxId  | E-mail inbox id, found at mailslurp.com |
| moderatorPassword | Password for moderatorUser |
| adminUserEmail  |  E-mail address for a admin user |
| adminUserMailSlurpInboxId  |  E-mail inbox id, found at mailslurp.com  |
| adminPassword  | Password for adminUser, if password auth is used   |
| adminTwoFactorSecret  | Two factor auth secret for admin users. Currently only implemented for admin user in admin panel. If left empty assumption is made that no 2 factor auth is required for admin panel.   |
| trustedEmailDomain  | Domain used for sending emails to random user,   |
| senderEmail  | E-mailaddress for sending e-mail when creating a site  |



## Running tests for different environments

The following scripts present in package.json makes it possible to easily run and open tests for different both staging and acc environments.

```
"open:staging": "cypress open --config-file cypress/config/staging.json",
"run:staging:subdir": "cypress run --config-file cypress/config/staging-subdir.json",
"open:staging:subdir": "cypress open --config-file cypress/onfig/staging-subdir.json",
"run:staging": "cypress run --config-file cypress/config/staging.json",
"open:acc": "cypress open --config-file cypress/config/acc.json",
"run:acc": "cypress run --config-file cypress/config/acc.json",
"open:acc:subdir": "cypress open --config-file cypress/config/acc-subdir.json",
"run:acc:subdir": "cypress run --config-file cypress/config/acc-subdir.json"
```

So for instance make sure a cypress/config/staging.json is present, and run :
```
npm run open:staging
```
and for acc  make sure a cypress/config/acc.json is present, and run :
```
npm run open:acc
```

Be aware config files expect environemt files to have a property env first. This is not the case for cypress.env.json.
So like this:

```
{
  "env" : {
    ...
  }
}
```

## Notes
Make all environment values  are present, sites are expected to exists. Admin creates and delete sites on the fly, but currently for speed and stability we have chosen to not do this yet for every type of site.

At the moment we advise using user and password login, e-mail authentication is relatively unstable since sometimes email take longer then a minute to arrive, although most of the time it's fast enough.

At the moment the tests don't work for sites with Basic Auth, although Cypress works well with it, after login we redirect via the API and here the Basic Auth credentials currently are not passed along.

The test running for liking anonymously is somewhat problematic, since it expects every 5 min, if it's move to the submitting an idea test it always works.

There are some tests, like newsletter submission that first time run won't work because it expects value to exist on second run this doesn't happen anymore.
