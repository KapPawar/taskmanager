from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

driver.get("http://localhost:3000/login")
time.sleep(3)

driver.find_element(By.ID, "email").send_keys("dnr8245@mavs.uta.edu")
time.sleep(2)

driver.find_element(By.ID, "password").send_keys("Devika@123")
time.sleep(2)

driver.find_element(By.XPATH, "//button[normalize-space(text())='Login Now']").click()
time.sleep(3)

# Verify success
success_text = driver.find_element(By.TAG_NAME, "body").text
assert "Welcome" in success_text
print("Test 1 passed: Successfully logged in.")

driver.quit()