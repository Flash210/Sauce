import { test } from "@playwright/test";
import { StudentRegistrationPage } from "./pages/StudentRegistrationPage";

test("Student Registration Form", async ({ page }) => {

  const form = new StudentRegistrationPage(page);

  await form.navigate();

  await form.fillName("Ali", "Marzoug");

  await form.fillEmail("ali@test.com");

  await form.selectGender();

  await form.fillMobile("20190055");

  await form.selectDateOfBirth("25 July 2000");

  await form.fillSubject("Maths");

  await form.selectHobby();

  await form.fillAddress("Douz");

  await form.selectStateCity("NCR", "Delhi");

  await form.submitForm();

  await form.verifySubmission();
});