Feature: Checkout a single product on SauceDemo

  As a logged-in customer
  I want to add one product to the cart and complete the checkout
  So that I can confirm my order is placed successfully

  Background:
    Given I am logged in as a standard user

  # ──────────────────────────────────────────────────────────────────────────
  # Scenario 1: Full happy-path checkout for one product
  # ──────────────────────────────────────────────────────────────────────────
  Scenario: Complete checkout for one product and see order confirmation
    Given I add the first product to the cart
    And I navigate to the cart
    When I proceed to checkout
    And I fill in my shipping information with "John" "Doe" "12345"
    And I continue to the order summary
    And I finish the order
    Then I should see the order confirmation message

  # ──────────────────────────────────────────────────────────────────────────
  # Scenario 2: Summary subtotal matches the product price
  # ──────────────────────────────────────────────────────────────────────────
  Scenario: Order summary subtotal matches the product price
    Given I add the first product to the cart
    And I navigate to the cart
    When I proceed to checkout
    And I fill in my shipping information with "John" "Doe" "12345"
    And I continue to the order summary
    Then the subtotal should match the product price

  # ──────────────────────────────────────────────────────────────────────────
  # Scenario 3: Validation error when shipping form is empty
  # ──────────────────────────────────────────────────────────────────────────
  Scenario: Show validation error when shipping info is missing
    Given I add the first product to the cart
    And I navigate to the cart
    When I proceed to checkout
    And I submit the checkout form without filling any field
    Then I should see the error "First Name is required"
