import { Page, expect } from "@playwright/test";

export class StudentRegistrationPage {

  private firstName = "#firstName";
  private lastName = "#lastName";
  private email = "#userEmail";
  private maleGender = "label[for='gender-radio-1']";
  private mobile = "#userNumber";
  private dateInput = "#dateOfBirthInput";
  private subject = "#subjectsInput";
  private sportsHobby = "label[for='hobbies-checkbox-1']";
  private address = "#currentAddress";
  private state = "#react-select-3-input";
  private city = "#react-select-4-input";
  private submit = "#submit";
  private modalTitle = "#example-modal-sizes-title-lg";

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://demoqa.com/automation-practice-form");
  }

  async fillName(first: string, last: string) {
    await this.page.fill(this.firstName, first);
    await this.page.fill(this.lastName, last);
  }

  async fillEmail(email: string) {
    await this.page.fill(this.email, email);
  }

  async selectGender() {
    await this.page.click(this.maleGender);
  }

  async fillMobile(number: string) {
    await this.page.fill(this.mobile, number);
  }

  async selectDateOfBirth(date: string) {
    await this.page.fill(this.dateInput, date);
    await this.page.press(this.dateInput, "Enter");
  }

  async fillSubject(subject: string) {
    await this.page.fill(this.subject, subject);
    await this.page.keyboard.press("Enter");
  }

  async selectHobby() {
    await this.page.click(this.sportsHobby);
  }

  async fillAddress(address: string) {
    await this.page.fill(this.address, address);
  }

  async selectStateCity(state: string, city: string) {
    await this.page.fill(this.state, state);
    await this.page.keyboard.press("Enter");

    await this.page.fill(this.city, city);
    await this.page.keyboard.press("Enter");
  }

  async submitForm() {
    await this.page.locator(this.submit).scrollIntoViewIfNeeded();
    await this.page.click(this.submit);
  }

  async verifySubmission() {
    await expect(this.page.locator(this.modalTitle))
      .toHaveText("Thanks for submitting the form");
  }
}