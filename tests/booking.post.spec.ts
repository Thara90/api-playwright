import { test, expect } from '@playwright/test';
import { Booking } from '../lib/datafactory/booking'
import * as createBookingReq from '../req-json/createBooking.json';

test.describe('booking/ POST requests', () => {
    const booking = new Booking();
    let roomID, checkin, checkout, firstName, lastName, userEmail, phoneNumber;

    test.beforeEach(async () => {
        roomID = booking.generateRandomRoomID();
        checkin = booking.generateRandomDates().checkin;
        checkout = booking.generateRandomDates().checkout;
        firstName = booking.generateRandomUserDetails().firstName;
        lastName = booking.generateRandomUserDetails().lastName;
        userEmail = booking.generateRandomUserDetails().userEmail;
        phoneNumber = booking.generateRandomUserDetails().phoneNumber;
    });

    test('Create a booking with all inputs', async ({ request }) => {
        const BookingReq = {
            ...createBookingReq,
            roomid: roomID,
            firstname: firstName,
            lastname: lastName,
            depositpaid: "true",
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: checkin,
                checkout: checkout
            }
        };
        const response = await request.post("booking/",
            {
                data: BookingReq
            });

        console.log(roomID, firstName, lastName, userEmail, phoneNumber, checkin, checkout);
        expect.soft(response.status()).toBe(201);
        const body = await response.json();
        console.log(JSON.stringify(body));
    });

    test('Create a booking without required inputs', async ({ request }) => {
        const BookingReq = {
            ...createBookingReq,
            roomid: roomID,
            email: userEmail,
            phone: phoneNumber,
            bookingdates: {
                checkin: checkin,
                checkout: checkout
            }
        };
        const response = await request.post("booking/",
            {
                data: BookingReq
            });

        console.log(roomID, firstName, lastName, userEmail, phoneNumber, checkin, checkout);

        expect.soft(response.status()).toBe(400);
        const body = await response.json();
        console.log(JSON.stringify(body));
    });

    // test('Create a booking with only required inputs', async ({ request }) => {
    //     const BookingReq = {
    //         ...createBookingReq,
    //         roomid: roomID,
    //         firstname: firstName,
    //         lastname: lastName,
    //         depositpaid: "true",
    //         bookingdates: {
    //             checkin: checkin,
    //             checkout: checkout
    //         }
    //     };
    //     const response = await request.post("booking/",
    //         {
    //             data: BookingReq
    //         });

    //     console.log(roomID, firstName, lastName, userEmail, phoneNumber, checkin, checkout);

    //     expect.soft(response.status()).toBe(201);
    //     const body = await response.json();
    //     console.log(JSON.stringify(body));

    // });


});