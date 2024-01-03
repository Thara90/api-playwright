import { faker } from "@faker-js/faker";
export class Booking {

    generateRandomRoomID() {
        let randomNumber: number = Math.floor(Math.random() * 400) + 1;
        return randomNumber;
    }

    generateRandomDates() {
        let currentDate = new Date();

        let randomCheckinDays = Math.floor(Math.random() * 30) + 1;
        let randomCheckoutDays = Math.floor(Math.random() * 10) + 1;

        let checkinDate = new Date(currentDate.getTime() + randomCheckinDays * 24 * 60 * 60 * 1000);
        let checkoutDate = new Date(checkinDate.getTime() + randomCheckoutDays * 24 * 60 * 60 * 1000);
        //let datesArray = [checkinDate.toISOString().split('T')[0],checkoutDate.toISOString().split('T')[0] ]
        return { checkin: checkinDate.toISOString().split('T')[0], checkout: checkoutDate.toISOString().split('T')[0] };
        //return datesArray;
    }

    generateRandomUserDetails() {
        let firstName = faker.person.firstName() + '_auto';
        let lastName = faker.person.lastName() + '_auto';
        let userEmail = firstName + '@mailinator.com';
        
        const min = 100000000000; // Minimum value with 12 digits
        const max = 999999999999; // Maximum value with 12 digits    
        let phoneNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        return { firstName: firstName, lastName: lastName, userEmail: userEmail, phoneNumber: phoneNumber };
    }
}