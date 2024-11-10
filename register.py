from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time

# Initialize the Chrome driver
driver = webdriver.Chrome()

# Navigate to the registration page
driver.get("http://localhost:3000/register")
time.sleep(3)

# Fill out the registration form fields
driver.find_element(By.ID, "name").send_keys("Devika N R")
time.sleep(2)

driver.find_element(By.ID, "email").send_keys("devi.rembhotkar99@gmail.com")
time.sleep(2)

driver.find_element(By.ID, "password").send_keys("Devika@7499")
time.sleep(2)

# Select role from dropdown
role_dropdown = Select(driver.find_element(By.ID, "role"))
role_dropdown.select_by_visible_text("user")  # Assuming "User" is one of the options
time.sleep(2)

# Submit the registration form
driver.find_element(By.ID, "register").click()
time.sleep(3)

# Verify successful registration
success_text = driver.find_element(By.TAG_NAME, "body").text
assert "Login to Your Account" in success_text
print("Test passed: Successfully registered the user.")

# Close the driver
driver.quit()
