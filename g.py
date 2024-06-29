from selenium import webdriver

# Путь к исполняемому файлу ChromeDriver
chrome_driver_path = r'C:\path\to\chromedriver.exe'

# Инициализация драйвера с использованием Service
driver = webdriver.Chrome(service=webdriver.chrome.service.Service(executable_path=chrome_driver_path))

# Откройте веб-сайт, на который вы уже вошли в своем основном браузере
driver.get('https://vk.com/app51480436_8047864')

# Получите текущие куки только для текущего домена
current_domain_cookies = [cookie for cookie in driver.get_cookies() if cookie['domain'] == 'vk.com']

# Теперь добавьте только куки для текущего домена
for cookie in current_domain_cookies:
    driver.add_cookie(cookie)

# Перейдите на нужную страницу после загрузки куки
driver.get('https://vk.com/app51480436_8047864')

# Теперь вы авторизованы с использованием сохраненных куки
    # Ожидаем ввода пользователя перед закрытием браузера
input("Press Enter to close the browser...")