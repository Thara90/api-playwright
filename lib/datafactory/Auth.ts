import { request ,expect} from "@playwright/test";

export class Auth {
    async createCookies(username,password,url) {
        let cookies: string = "";
        const contextRequest = await request.newContext();
        const response = await contextRequest.post(url+"auth/login", {
            data: {
                username: username,
                password: password,
            },
        });
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        cookies = headers["set-cookie"];
        return cookies;
    }

}