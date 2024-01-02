import { test, expect } from '@playwright/test';

test.describe('booking/ GET requests', () => {
    let cookies: string = "";

    test.beforeAll(async ({ request }) => {
        const response = await request.post("auth/login", {
            data: {
                username: "admin",
                password: "password",
            },
        });
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        cookies = headers["set-cookie"];
    });

    //************** booking summary **************//
    test('Get booking summary with specific room id', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=1");

        expect(response.status()).toBe(200);

        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    });

    test('Get booking summary with room id does not exists', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=1000");

        expect(response.status()).toBe(200);

        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.bookings.length).toBeGreaterThanOrEqual(0);
    });

    test('Get booking summary when room id is empty', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=");

        expect(response.status()).toBe(500);
        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.status).toBe(500);
        expect(body.error).toBe("Internal Server Error");
    });

    //************** get all bookings **************//
    test('Get all bookings with authentication', async ({ request }) => {
        const response = await request.get("booking/", {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(JSON.stringify(body));
        expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    });

    test('Get all bookings without authentication', async ({ request }) => {
        const response = await request.get("booking/");

        expect(response.status()).toBe(403);
        const body = await response.text();
        expect(body).toBe("");
    });

    //************** get booking by id **************//
    test('Get a booking by id', async ({ request }) => {
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

    test('Get a booking by id that does not exist', async ({ request }) => {
        const response = await request.get("booking/1000", {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(404);

        const body = await response.text();
        expect(body).toBe("");
    });

    test('Get a booking by id without authentication', async ({ request }) => {
        const response = await request.get("booking/1000");

        expect(response.status()).toBe(403);

        const body = await response.text();
        expect(body).toBe("");
    });

});