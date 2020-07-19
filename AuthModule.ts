import { PublicClientApplication, SilentFlowRequest, AuthenticationResult, Configuration, LogLevel, AccountInfo, InteractionRequiredAuthError, EndSessionRequest, RedirectRequest, PopupRequest } from "@azure/msal-browser";
import { UIManager } from "./UIManager";

function buildMSALConfig(clientId: string, tenantId: string): Configuration {
    return  {
        auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${tenantId}` // single tenant authority
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: false,
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {	
                        return;	
                    }	
                    // switch (level) {	
                    //     case LogLevel.Error:	
                    //         console.error(message);	
                    //         return;	
                    //     case LogLevel.Info:	
                    //         console.info(message);	
                    //         return;	
                    //     case LogLevel.Verbose:	
                    //         console.debug(message);	
                    //         return;	
                    //     case LogLevel.Warning:	
                    //         console.warn(message);	
                    //         return;	
                    // }
                }
            }
        }
    }
}

export class AuthModule {
    private myMSALObj: PublicClientApplication
    private account: AccountInfo | null | undefined; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_account_accountinfo_.html
    private loginRedirectRequest: RedirectRequest; // TODO: Publish ref docs for RedirectRequest
    private loginRequest: PopupRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_request_authorizationurlrequest_.html
    private profileRedirectRequest: RedirectRequest;
    private profileRequest: PopupRequest;
    // private mailRedirectRequest: RedirectRequest;
    // private mailRequest: PopupRequest;
    private silentProfileRequest: SilentFlowRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_request_silentflowrequest_.html
    // private silentMailRequest: SilentFlowRequest;

    constructor(clientId: string, tenantId: string) {
        // this.myMSALObj = new PublicClientApplication(buildMSALConfig(clientId, tenantId));
        this.account = null;
        this.loginRequest = {scopes:[]}
        // this.loginRedirectRequest = {...this.loginRequest, redirectStartPage: window.location.href}
        this.profileRequest = {scopes: ["User.Read"]}
    
        // this.profileRedirectRequest = {
        //     ...this.profileRequest,
        //     redirectStartPage: window.location.href
        // };
        // this.silentProfileRequest = {
        //     scopes: ["openid", "profile", "User.Read"],
        //     account: this.account,
        //     forceRefresh: false
        // };
    }

    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     * 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    private getAccount(): ( AccountInfo | null | undefined ) {
        // need to call getAccount here?
        const currentAccounts = this.myMSALObj.getAllAccounts();
        if (currentAccounts === null) {
            console.log("No accounts detected");
            return null;
        }

        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log("Multiple accounts detected, need to add choose account code.");
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        }
    }

    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response 
     */
    handleResponse(response: AuthenticationResult) {
        if (response !== null) {
            this.account = response.account;
        } else {
            this.account = this.getAccount();
        }

        if (this.account) {
            // UIManager.showWelcomeMessage(this.account);
        }
    }

    /**
     * Calls loginPopup or loginRedirect based on given signInType.
     * @param signInType 
     */
    login(signInType: string): void {
        if (signInType === "loginPopup") {
            this.myMSALObj.loginPopup(this.loginRequest).then((resp: AuthenticationResult) => {
                this.handleResponse(resp);
            }).catch(console.error);
        } else if (signInType === "loginRedirect") {
            this.myMSALObj.loginRedirect(this.loginRedirectRequest);
        }
    }

    /**
     * Logs out of current account.
     */
    logout(): void {
        const logOutRequest: EndSessionRequest = {
            account: this.account
        };

        this.myMSALObj.logout(logOutRequest);
    }

    /**
     * Gets the token to read user profile data from MS Graph silently, or falls back to interactive redirect.
     */
    async getProfileTokenRedirect(): Promise<string> {
        this.silentProfileRequest.account = this.account;
        return this.getTokenRedirect(this.silentProfileRequest, this.profileRedirectRequest);
    }

    /**
     * Gets the token to read user profile data from MS Graph silently, or falls back to interactive popup.
     */
    async getProfileTokenPopup(): Promise<string> {
        this.silentProfileRequest.account = this.account;
        return this.getTokenPopup(this.silentProfileRequest, this.profileRequest);
    }

    /**
     * Gets a token silently, or falls back to interactive popup.
     */
    private async getTokenPopup(silentRequest: SilentFlowRequest, interactiveRequest: PopupRequest): Promise<string> {
        try {
            const response: AuthenticationResult = await this.myMSALObj.acquireTokenSilent(silentRequest);
            return response.accessToken;
        } catch (e) {
            console.log("silent token acquisition fails.");
            if (e instanceof InteractionRequiredAuthError) {
                console.log("acquiring token using redirect");
                return this.myMSALObj.acquireTokenPopup(interactiveRequest).then((resp) => {
                    return resp.accessToken;
                }).catch((err) => {
                    console.error(err);
                    return null;
                });
            } else {
                console.error(e);
            }
        }
    }

    /**
     * Gets a token silently, or falls back to interactive redirect.
     */
    // private async getTokenRedirect(silentRequest: SilentFlowRequest, interactiveRequest: RedirectRequest): Promise<string> {
    //     try {
    //         const response = await this.myMSALObj.acquireTokenSilent(silentRequest);
    //         return response.accessToken;
    //     } catch (e) {
    //         console.log("silent token acquisition fails.");
    //         if (e instanceof InteractionRequiredAuthError) {
    //             console.log("acquiring token using redirect");
    //             this.myMSALObj.acquireTokenRedirect(interactiveRequest).catch(console.error);
    //         } else {
    //             console.error(e);
    //         }
    //     }
    // }
    
}