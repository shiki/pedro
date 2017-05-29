# API

It looks like I have to use OAuth2 and JWT (JSON Web Token). [This page](https://aaronparecki.com/oauth-2-simplified/) has a good summary on how OAuth2 works. Based on that, I can use the _Password Grant Type_. In that `POST /token` endpoint, I can return an access token which can be a JWT that can then be used for normal API requests.

With the auth workflow process, I don't think I even need to use a third party library.

## Process

1. Client will send a `POST /token`

       POST https://api.oauth2server.com/token
          grant_type=password&
          username=USERNAME&
          password=PASSWORD&
          client_id=CLIENT_ID

   Note that the parameters should be in the `POST` body since that would be more secure.

   The endpoint will return an `access_token`. This will be JWT and will be used for subsequent requests.

   Perhaps for now, I can just use an iOS app identity key for the `username` and `password`. Or maybe I don't even need the `password`. 

2. With the token from `POST /token`, subsequent requests will provide the token in the header

        curl -H "Authorization: Bearer RsT5OjbzRn430zqMLgV3Ia" \
        https://api.oauth2server.com/1/me

## Access Tokens (JWT)

We will be using JWT as access tokens since it does not require us to store any access token data on the server at all. This [article](https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec) quite simply describes how JWT works.

I should still probably log the generated JWT so I can track possible abuse.

HS256 (HMAC SHA256) will be used for signing.

## Implementation

* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) will be used for generating web tokens
* [hapi](https://hapijs.com/) will be used as the main framework
* No library will be used for OAuth2. We just need to follow the protocol described in the _Process_ section.

## Resources

* This article describes how the OAuth2 workflow works [Mobile API Security Techniques, Part 2](https://hackernoon.com/mobile-api-security-techniques-fc1f577840ab)
  * There's an idea here about authenticating the client by looking at the client app's integrity. It's probably too early for me to implement this.
* [OAuth2 Simplified](https://aaronparecki.com/oauth-2-simplified/)
  * A more simplified article about the OAuth2 workflow
* [The Ultimate Guide to Mobile API Security](https://stormpath.com/blog/the-ultimate-guide-to-mobile-api-security)
* [Stateless authentication with OAuth 2 and JWT - JavaZone 2015](https://www.slideshare.net/alvarosanchezmariscal/stateless-authentication-with-oauth-2-and-jwt-javazone-2015)
* There was a critical vulnerability for JWT described [here](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/). Just something to watch out for.
* This StackExchange answer describes the difference between HS256 and ECDSA-SHA256: https://crypto.stackexchange.com/a/30658