import { test, expect } from '@playwright/test';

test.describe('booking/ GET requests', () => {
    let cookies: string = "";

    test.beforeAll( async ({ request }) => {
        const response = await request.post("auth/login",{
            data : {
                username : "admin",
                password : "password",
            },
        });
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        cookies = headers["set-cookie"];
        console.log(cookies);

    });

    test('Get booking summary', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=1");
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(JSON.stringify(body));
        //console.log(body.bookings.length);
        expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    });

    test('Get all bookings', async ({ request }) => {
        const response = await request.get("booking/", {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    });

    test('Get a booking with ID', async ({ request }) => {
        const response = await request.get("booking/1", {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.bookingid).toBe(1);
        expect(body.roomid).toBe(1);
        expect(body.firstname).toBe("James");
        expect(body.lastname).toBe("Dean");
        expect(body.depositpaid).toBe(true);
    });

});