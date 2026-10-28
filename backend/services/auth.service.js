import * as client from 'openid-client';
import dotenv from 'dotenv';

//Sorry for this ugly code and the auth controller; I don't have the bravery to change it 
export async function login(redirectUrl) {
    let server // Authorization Server's Issuer Identifier
    let clientId // Client identifier at the Authorization Server
    let clientSecret // Client Secret

    server = new URL(process.env.ISSUER);
    clientId = process.env.CLIENT_ID;
    clientSecret = process.env.CLIENT_SECRET

    let config = await client.discovery(
        server,
        clientId,
        clientSecret,
    )

    let redirect_uri = redirectUrl;
    let scope = "openid profile email" // Scope of the access request


    let code_verifier = client.randomPKCECodeVerifier()
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
    let state = ""

    let parameters = {
        redirect_uri,
        scope,
        code_challenge,
        code_challenge_method: 'S256',
    }

    if (!config.serverMetadata().supportsPKCE()) {
        state = client.randomState()
        parameters.state = state
    }
    let redirectTo = client.buildAuthorizationUrl(config, parameters)

    return {
        "redirectUrl": redirectTo.href,
        code_verifier,
        state
    }
}

export async function verifyLogin(currentUrl, code_verifier, state) {
    const issuerUrlString = process.env.ISSUER
    const clientID = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET

    if (issuerUrlString == undefined || clientID == undefined || clientSecret == undefined) {
        throw new APIError("OIDC/ENV_NOT_SET");
    }

    const issuer = new URL(issuerUrlString);

    const config = await client.discovery(
        issuer,
        clientID,
        clientSecret,
    )
    const tokens = await client.authorizationCodeGrant(
        config,
        currentUrl,
        {
            pkceCodeVerifier: code_verifier,
            expectedState: state == "" ? undefined : state,
            idTokenExpected: true
        }
    )

    const claims = tokens.claims()
    const userData = await client.fetchUserInfo(config, tokens.access_token, claims.sub)
    //We save the idToken for disconnection with eirbconnect
    return {
        login: userData.uid,
        firstName: userData.prenom,
        lastName: userData.nom,
        token_id: tokens.id_token,
    };
}

export function isLogged(request) {
    return request.session.user;
}
export function currentLogin(request) {
    return request.session.user.login;
}
