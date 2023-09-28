import { test, expect } from '@playwright/test';
let _bookingId: number;

test.describe('API Test Suite', () => {

  test('Create a booking', async ({ request, baseURL }) => {
    const _response = await request.post(`${baseURL}`,
      {
        data: {
          "firstname": "Jane",
          "lastname": "Brown",
          "totalprice": 1000,
          "depositpaid": true,
          "bookingdates": {
            "checkin": "2018-12-1",
            "checkout": "2019-01-01"
          },
          "additionalneeds": "Breakfast"
        }
      });

    expect(_response.status()).toBe(200);
    expect(_response.ok()).toBeTruthy();
    const response = await _response.json();
    _bookingId = response.bookingid;
    console.log(response);

  });

  test('Get a booking', async ({ request, baseURL }) => {
    const _response = await request.get(`${baseURL}/${_bookingId}`);
    expect(_response.status()).toBe(200);
    expect(_response.ok()).toBeTruthy();
    const response = await _response.json();
    console.log(response);

  });

  test('Get all bookings', async ({ request, baseURL }) => {
    const _response = await request.get(`${baseURL}`);
    expect(_response.status()).toBe(200);
    expect(_response.ok()).toBeTruthy();
    const response = await _response.json();
    console.log(response);

  });

  test('Update a bookings', async ({ request, baseURL }) => {
    const _response = await request.put(`${baseURL}/${_bookingId}`,
      {
        data: {
          "firstname": "Jane",
          "lastname": "Brown",
          "totalprice": 5000,
          "depositpaid": false,
          "bookingdates": {
            "checkin": "2018-12-1",
            "checkout": "2019-01-01"
          },
          "additionalneeds": "Breakfast"
        }
      });

    expect(_response.status()).toBe(200);
    expect(_response.ok()).toBeTruthy();
    const response = await _response.json();
    console.log(response);

  });

  test('Delete a booking', async ({ request, baseURL }) => {
    const _response = await request.delete(`${baseURL}/${_bookingId}`);
    expect(_response.status()).toBe(201);
    expect(_response.ok()).toBeTruthy();
    console.log(_response);

  });
});
