from selenium import webdriver

chrome_driver_path = r'C:\path\to\chromedriver.exe'

# Инициализация драйвера с использованием Service
driver = webdriver.Chrome(service=webdriver.chrome.service.Service(executable_path=chrome_driver_path))

# Загрузить куки из вашего основного браузера
# cookies - это словарь куков, который вы должны получить из вашего браузера
cookies = [
    {'name': 'remixnsid', 'value': 'vk1.a.aZGzEdreMfHxx0QUGXs5Uyt9Rb84ONKdfmuAlMA9n8dmJMmTsBRliMEztnquA-XPRDuaKxbJHrBElOyxSt00XBKCUxxRcRTaX-p6V1Tz2L4eY3YIRLXb8YXksykT17qr_QgTITJVfKmH_IkAz41VP_us7WXih5btH0Jekok_XxLCRMsTcZPf7bso38FDHUpX', 'domain': 'vk.com'}
   
    # Добавьте другие куки по необходимости
]
# Загружаем страницу vk.com
driver.get('https://vk.com/app51480436_8047864')

# Пауза, чтобы вы могли войти в аккаунт на странице vk.com
input("Press Enter after signing in on vk.com")

for cookie in cookies:
    try:
        driver.add_cookie(cookie)
    except Exception as e:
        print(f"Ошибка при добавлении куки: {e}")

# Перейти на нужную страницу после загрузки куки
driver.get('https://vk.com/app51480436_8047864')

# Теперь вы авторизованы с использованием сохраненных куки
