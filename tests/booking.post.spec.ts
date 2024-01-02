import { test, expect } from '@playwright/test';
import {Booking} from '../lib/datafactory/booking'

test.describe('booking/ POST requests', () => {
const booking = new Booking();

    test.only('Create a booking', async ({ request }) => {
        const response = await request.post("booking/",
            {
                data: {
                    "bookingid": 12,
                    "roomid": 12,
                    "firstname": "test",
                    "lastname": "user",
                    "depositpaid": true,
                    "email": "test@mailinator.com",
                    "phone": "071112333123",
                    "bookingdates": {
                        "checkin": "2024-12-19",
                        "checkout": "2024-12-22"
                    }
                }
            });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.booking.bookingid).toBe(body.bookingid);
        expect(body.booking.firstname).toBe("test");
        expect(body.booking.lastname).toBe("user");

    });

});