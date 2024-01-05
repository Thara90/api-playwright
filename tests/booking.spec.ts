import { test, expect } from '@playwright/test';
import { Booking } from '../lib/datafactory/Booking'
import * as createBookingReq from '../req-json/createBooking.json';

test.describe('booking API', () => {
    let cookies: string = "";
    let savedBookingId, savedRoomId;
    const booking = new Booking();
    let roomID, bookingDates, firstName, lastName, userEmail, phoneNumber;

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

    //************** POST **************//
    test('001. Create a booking with all inputs', async ({ request }) => {
        roomID = booking.generateRandomRoomID();
        bookingDates = booking.generateRandomDates();
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;

        let BookingReq = {
            ...createBookingReq,
            roomid: roomID,
            firstname: firstName,
            lastname: lastName,
            depositpaid: "true",
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: bookingDates.checkin,
                checkout: bookingDates.checkout
            }
        };
        const response = await request.post("booking/",
            {
                data: BookingReq
            });

        console.log(roomID, firstName, lastName, userEmail, phoneNumber, bookingDates.checkin, bookingDates.checkout);

        expect.soft(response.status()).toBe(201);

        const body = await response.json();
        expect.soft(body.bookingid).toBeGreaterThan(1);

        await test.step("Verify booking was created", async () => {
            expect.soft(body.booking.bookingid).toBe(body.bookingid);
            expect.soft(body.booking.roomid).toBe(roomID);
            expect.soft(body.booking.firstname).toBe(firstName);
            expect.soft(body.booking.lastname).toBe(lastName);
            expect.soft(body.booking.bookingdates.checkin).toBe(bookingDates.checkin);
            expect.soft(body.booking.bookingdates.checkout).toBe(bookingDates.checkout);
        });

        console.log(JSON.stringify(body));
        savedBookingId = body.booking.bookingid;
        savedRoomId = body.booking.roomid;
    });

    test('002. Create a booking without required inputs', async ({ request }) => {
        roomID = booking.generateRandomRoomID();
        bookingDates = booking.generateRandomDates();
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;

        let BookingReq = {
            ...createBookingReq,
            roomid: roomID,
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: bookingDates.checkin,
                checkout: bookingDates.checkout
            }
        };
        const response = await request.post("booking/",
            {
                data: BookingReq
            });

        console.log(roomID, firstName, lastName, userEmail, phoneNumber, bookingDates.checkin, bookingDates.checkout);

        expect.soft(response.status()).toBe(400);

        const body = await response.json();

        expect.soft(body.errorCode).toBe(400);
        expect.soft(body.error).toBe("BAD_REQUEST");

        console.log(JSON.stringify(body));
    });

    //************** GET **************//
    //************** booking summary **************//
    test('003. Get booking summary with specific room id', async ({ request }) => {
        console.log(savedRoomId);
        const response = await request.get(`booking/summary?roomid=${savedRoomId}`);

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect.soft(body.bookings.length).toBeGreaterThanOrEqual(1);

        console.log(JSON.stringify(body));
    });

    test('004. Get booking summary with room id does not exists', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=1000");

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect.soft(body.bookings.length).toBeGreaterThanOrEqual(0);

        console.log(JSON.stringify(body));
    });

    test('005. Get booking summary when room id is empty', async ({ request }) => {
        const response = await request.get("booking/summary?roomid=");

        expect.soft(response.status()).toBe(500);

        const body = await response.json();

        expect.soft(body.status).toBe(500);
        expect.soft(body.error).toBe("Internal Server Error");

        console.log(JSON.stringify(body));
    });

    //************** get booking by id **************//
    test('006. Get a booking by id', async ({ request }) => {
        const response = await request.get(`booking/${savedBookingId}`, {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.bookingid).toBe(savedBookingId);
        expect(body.roomid).toBe(savedRoomId);
        // expect(body.firstname).toBe("James");
        // expect(body.lastname).toBe("Dean");
        // expect(body.depositpaid).toBe(true);

        console.log(JSON.stringify(body));
    });

    test('007. Get a booking by id that does not exist', async ({ request }) => {
        const response = await request.get("booking/1000", {
            headers: { cookie: cookies },
        });

        expect(response.status()).toBe(404);

        const body = await response.text();
        expect(body).toBe("");
    });

    test('008. Get a booking by id without authentication', async ({ request }) => {
        const response = await request.get("booking/1000");

        expect(response.status()).toBe(403);

        const body = await response.text();
        expect(body).toBe("");
    });

    //************** PUT **************//
    test('009. Update a booking with specific booking id', async ({ request }) => {
        bookingDates = booking.generateRandomDates();
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;

        let BookingReq = {
            ...createBookingReq,
            bookingid: savedBookingId,
            roomid: savedRoomId,
            firstname: firstName,
            lastname: lastName,
            depositpaid: "false",
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: bookingDates.checkin,
                checkout: bookingDates.checkout
            }
        };
        const response = await request.put(`booking/${savedBookingId}`,
            {
                headers: { cookie: cookies },
                data: BookingReq
            });

        console.log(savedBookingId, savedRoomId, firstName, lastName, bookingDates.checkin, bookingDates.checkout);

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect.soft(body.bookingid).toBeGreaterThan(1);

        await test.step("Verify booking was updated", async () => {
            expect.soft(body.booking.bookingid).toBe(body.bookingid);
            expect.soft(body.booking.roomid).toBe(savedRoomId);
            expect.soft(body.booking.firstname).toBe(firstName);
            expect.soft(body.booking.lastname).toBe(lastName);
            expect.soft(body.booking.bookingdates.checkin).toBe(bookingDates.checkin);
            expect.soft(body.booking.bookingdates.checkout).toBe(bookingDates.checkout);
        });
        
        console.log(JSON.stringify(body));
        savedBookingId = body.booking.bookingid;
    });

    test('010. Update a booking without authentication', async ({ request }) => {
        bookingDates = booking.generateRandomDates();
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;

        let BookingReq = {
            ...createBookingReq,
            bookingid: savedBookingId,
            roomid: savedRoomId,
            firstname: firstName,
            lastname: lastName,
            depositpaid: "false",
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: bookingDates.checkin,
                checkout: bookingDates.checkout
            }
        };
        const response = await request.put(`booking/${savedBookingId}`,
            {
                data: BookingReq
            });

        console.log(savedBookingId, savedRoomId, firstName, lastName, bookingDates.checkin, bookingDates.checkout);

        expect.soft(response.status()).toBe(403);

        const body = await response.text();
        expect.soft(body).toBe("");
    });

    test('011. Update a booking that does not exists', async ({ request }) => {
        bookingDates = booking.generateRandomDates();
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;

        let BookingReq = {
            ...createBookingReq,
            bookingid: savedBookingId,
            roomid: savedRoomId,
            firstname: firstName,
            lastname: lastName,
            depositpaid: "false",
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: bookingDates.checkin,
                checkout: bookingDates.checkout
            }
        };
        const response = await request.put(`booking/9999`,
            {
                headers: { cookie: cookies },
                data: BookingReq
            });

        expect.soft(response.status()).toBe(404);

        const body = await response.text();
        expect.soft(body).toBe("");
    });

    // test('010. Update a booking with empty request body', async ({ request }) => {
    //     let BookingReq = {
    //         ...createBookingReq,
    //         bookingid: "",
    //         roomid: "",
    //         firstname: "",
    //         lastname: "",
    //         depositpaid: "",
    //         email: "",
    //         phone: "",
    //         bookingdates: {
    //             checkin: "",
    //             checkout: ""
    //         }
    //     };
    //     const response = await request.put(`booking/9999`,
    //         {
    //             data: BookingReq
    //         });

    //     expect.soft(response.status()).toBe(400);

    //     const body = await response.json();

    //     expect.soft(body.status).toBe(400);
    //     expect.soft(body.error).toBe("Bad Request");
    // });

    //************** DELETE **************//
    test("012. DELETE booking that does not exists", async ({ request }) => {
        const response = await request.delete("booking/9999", {
            headers: { cookie: cookies },
        });

        expect.soft(response.status()).toBe(404);

        const body = await response.text();
        expect.soft(body).toBe("");
    });

    test("013. DELETE booking without authentication", async ({ request }) => {
        const response = await request.delete(`booking/${savedBookingId}`);

        expect.soft(response.status()).toBe(403);

        const body = await response.text();
        expect.soft(body).toBe("");
    });

    test("014. DELETE booking with specific booking id", async ({ request }) => {
        const response = await request.delete(`booking/${savedBookingId}`, {
            headers: { cookie: cookies },
        });

        expect.soft(response.status()).toBe(202);

        const body = await response.text();
        expect.soft(body).toBe("");
    });
});