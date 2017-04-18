# Probot: Cpplint

> a GitHub Integration built with [Probot](https://github.com/probot/probot)
that automatically identifies [cpplint](https://github.com/google/styleguide/tree/gh-pages/cpplint)
issues during code reivew.

![image](https://cloud.githubusercontent.com/assets/2557445/25150046/e7a09e46-2480-11e7-9407-a66e42c66ff5.png)

See [probot-cpplint-test#10](https://github.com/hokein/probot-cpplint-test/pull/10)
for an example.

## Deploy to Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. Create a GitHub integration:
   * Webhook URL: `<your_app>.herokuapp.com` and we will know it when creating a
     new heroku app (`heroku create`)
   * Webhook secret: `<random_string>`
   * Permissions & events: `Read & write` on `Pull requests` and `Repository contents`

3. Download the private key `prod.pem` and remember your integration id.

4. Install the GitHub integration by clicking `Install` button on the `settings`
page.

5. Clone this repository `git clone https://github.com/hokein/probot-cpplint.git`.

6. Deploy to Heroku, run the following commands:

     ```bash
     $ cd /path/to/probot-cpplint
     // Create a heroku app
     $ heroku create
     // Set configuration
     $ heroku config:set WEBHOOK_SECRET="" PRIVATE_KEY="$(cat /path/to/prod.pem)" INTEGRATION_ID=<integration_id>
     // Deploy the plugin to heroku
     $ git push heroku master
     ```

The probot plugin should be up and working now. Create a test repository to test
it. See the [official doc](https://github.com/probot/probot/blob/master/docs/deployment.md#deploy)
for more details.
