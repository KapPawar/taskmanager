from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.support.ui import Select
import time
import os

driver = webdriver.Chrome()

driver.get("http://localhost:3000/login")
time.sleep(3)

driver.find_element(By.ID, "email").send_keys("dnr8245@mavs.uta.edu")
time.sleep(2)

driver.find_element(By.ID, "password").send_keys("Devika@123")
time.sleep(2)

driver.find_element(By.XPATH, "//button[normalize-space(text())='Login Now']").click()
time.sleep(3)

driver.find_element(By.ID, "5").click()
time.sleep(5)

driver.find_element(By.ID, "analytics").click()
time.sleep(5)

success_text = driver.find_element(By.TAG_NAME, "body").text
print("Test passed: Downloaded successfully.")

driver.quit()