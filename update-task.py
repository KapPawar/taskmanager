from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.support.ui import Select
import time
import os

# Initialize the Chrome driver
driver = webdriver.Chrome()

driver.get("http://localhost:3000/login")
time.sleep(3)

driver.find_element(By.ID, "email").send_keys("dnr8245@mavs.uta.edu")
time.sleep(2)

driver.find_element(By.ID, "password").send_keys("Devika@123")
time.sleep(2)

driver.find_element(By.XPATH, "//button[normalize-space(text())='Login Now']").click()
time.sleep(3)

# Wait for the notification to disappear before clicking on addtask
try:
    WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CLASS_NAME, "Toastify__toast-container")))
except:
    print("Toast notification did not disappear in time")

driver.find_element(By.ID, "0").click()
time.sleep(5)

driver.find_element(By.ID, "edit-6730ecc33851b44aadea9e93").click()
time.sleep(2)

driver.find_element(By.ID, "desc").send_keys("for Sample Task.")
time.sleep(2)

driver.find_element(By.ID, "create").click()
time.sleep(3)

success_text = driver.find_element(By.TAG_NAME, "body").text
assert "Sample Task Title" in success_text
print("Test passed: Task updated successfully.")

driver.quit()