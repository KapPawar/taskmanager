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

# Now attempt to click the addtask button
driver.find_element(By.ID, "addtask").click()
time.sleep(5)

# Fill out the task creation form fields as usual...
# [The rest of your task creation code]


# Enter Title
driver.find_element(By.ID, "title").send_keys("Sample Task Title")
time.sleep(2)

# Enter Description
driver.find_element(By.ID, "desc").send_keys("This is a sample task description.")
time.sleep(2)

# Select Priority
priority_dropdown = Select(driver.find_element(By.ID, "priority"))
priority_dropdown.select_by_visible_text("High")  # Options: Low, High, Medium
time.sleep(2)

# Set Due Date
due_date_field = driver.find_element(By.ID, "date")
due_date_field.clear()  # Clear any pre-filled date
due_date_field.send_keys("12/31/2024")  # Format as MM/DD/YYYY
time.sleep(2)

# Select Task Completed status
completed_dropdown = Select(driver.find_element(By.ID, "completed"))
completed_dropdown.select_by_visible_text("No")  # Options: Yes, No
time.sleep(2)

# Upload a file
# file_path = os.path.abspath("/Users/devikarembhotkar/Downloads/my-document.pdf")  # Replace with your actual file path
# driver.find_element(By.ID, "fileUpload").send_keys(file_path)
# time.sleep(3)

# Submit the form
driver.find_element(By.ID, "create").click()
time.sleep(3)

# Verify successful task creation
success_text = driver.find_element(By.TAG_NAME, "body").text
assert "Sample Task Title" in success_text
print("Test passed: Task created successfully.")

# Close the driver
driver.quit()
