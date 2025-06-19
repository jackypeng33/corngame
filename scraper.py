import cloudscraper
import json
import requests
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_driver():
    """
    Tries to initialize a Selenium webdriver for Chrome, Firefox, or Edge.
    """
    # Try Chrome
    try:
        print("尝试初始化 Chrome 浏览器...")
        options = ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        print("Chrome 初始化成功。")
        return driver
    except Exception as e:
        print(f"Chrome 初始化失败: {e}")

    # Try Firefox
    try:
        print("尝试初始化 Firefox 浏览器...")
        options = FirefoxOptions()
        options.add_argument("--headless")
        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)
        print("Firefox 初始化成功。")
        return driver
    except Exception as e:
        print(f"Firefox 初始化失败: {e}")

    # Try Edge
    try:
        print("尝试初始化 Edge 浏览器...")
        options = EdgeOptions()
        options.add_argument("--headless")
        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=options)
        print("Edge 初始化成功。")
        return driver
    except Exception as e:
        print(f"Edge 初始化失败: {e}")
        
    return None

def scrape_from_html():
    """
    Scrapes game data from the HTML of the website's main page using Selenium.
    """
    print("\nAPI a尝试失败，转为从 HTML 页面爬取 (使用 Selenium)...")
    
    driver = get_driver()
    if not driver:
        print("所有浏览器都初始化失败。")
        return []
    
    URL = "https://gamedistribution.com/"
    html_content = ""
    try:
        driver.get(URL)
        wait = WebDriverWait(driver, 30) # Increased wait time
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a[href^="/games/"]')))
        
        # Scroll down to load more games
        last_height = driver.execute_script("return document.body.scrollHeight")
        for _ in range(5): # scroll a few times
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(4)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
            print("向下滚动加载更多游戏...")

        html_content = driver.page_source
        print("成功获取并渲染主页面。")

    except Exception as e:
        print(f"使用 Selenium 获取页面时出错: {e}")
        return []
    finally:
        if driver:
            driver.quit()

    soup = BeautifulSoup(html_content, 'html.parser')
    games_data = []
    
    game_links = soup.find_all('a', href=lambda href: href and href.startswith('/games/'))
    print(f"找到 {len(game_links)} 个潜在的游戏链接。")

    unique_games = {}

    for link in game_links:
        game_href = link.get('href')
        if not game_href:
            continue
            
        game_url = f"https://gamedistribution.com{game_href}"
        
        # Avoid duplicates based on URL
        if game_url in unique_games:
            continue

        img = link.find('img')
        icon_url = ""
        if img and img.has_attr('src'):
             icon_url = img['src']

        title = ""
        # The title is inside a div with a specific class structure
        title_div = link.find('div', class_=lambda c: c and 'GameCard-styles__Title' in c)
        if title_div:
            title = title_div.text.strip()
        
        if not title:
            # Fallback title
            title = (img.get('alt') if img else '') or game_href.split('/')[-2].replace('-', ' ').title()

        game_id = title.lower().replace(' ', '-').replace(':', '')

        if not game_id:
            continue

        game_info = {
            "id": game_id,
            "title": title,
            "description": "", # Description is on the detail page
            "icon": icon_url,
            "gameUrl": game_url,
            "categories": [],
            "tags": []
        }
        unique_games[game_url] = game_info
    
    games_data = list(unique_games.values())
    print(f"成功从 HTML 解析 {len(games_data)} 个游戏。")
    return games_data

def try_api_endpoints():
    """
    Try different API endpoints to get game data
    """
    API_URLS = [
        "https://api.gamedistribution.com/v1/games",
        "https://api.gamedistribution.com/games", 
        "https://gamedistribution.com/api/games",
        "https://api.gamedistribution.com/v1/games?collection=all"
    ]
    
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,zh;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://gamedistribution.com/",
        "Origin": "https://gamedistribution.com",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
    }
    
    print("尝试从 GameDistribution API 获取数据...")
    scraper = cloudscraper.create_scraper()
    
    for i, url in enumerate(API_URLS):
        print(f"\n尝试方法 {i+1}: {url}")
        try:
            response = scraper.get(url, headers=HEADERS, timeout=10)
            print(f"状态码: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"成功! 获取到 {len(data) if isinstance(data, list) else '非列表'} 个游戏")
                    if isinstance(data, list) and len(data) > 0:
                        return data
                except json.JSONDecodeError:
                    print("响应不是有效的 JSON")
                    
            else:
                print(f"请求失败，状态码: {response.status_code}")
                
        except Exception as e:
            print(f"请求 {url} 时出错: {e}")
        
        time.sleep(1)  # 请求间隔
    
    return None

def scrape_games():
    """
    Scrapes game data and saves it to a JSON file.
    """
    # 首先尝试从 API 获取数据
    api_games = try_api_endpoints()
    
    formatted_games = []
    if api_games:
        # 处理 API 数据
        for game in api_games:
            if isinstance(game, dict):
                formatted_game = {
                    "id": game.get('url') or game.get('id'),
                    "title": game.get('title'),
                    "description": game.get('description'),
                    "icon": game.get('assets', {}).get('cover_small', '') or game.get('icon'),
                    "gameUrl": game.get('gameUrl') or f"https://html5.gamedistribution.com/{game.get('url')}/",
                    "categories": [cat['name'] for cat in game.get('categories', [])] if 'categories' in game and isinstance(game['categories'], list) and game['categories'] and isinstance(game['categories'][0], dict) else game.get('categories', []),
                    "tags": game.get('tags', []),
                    "width": game.get('width'),
                    "height": game.get('height')
                }
                formatted_games.append(formatted_game)
    else:
        # 如果 API 失败，则尝试 HTML 爬取
        formatted_games = scrape_from_html()

    if not formatted_games:
        print("\n所有爬取方法都失败了，未能获取任何游戏数据。")
        return

    # 保存数据到 JSON 文件
    with open('game.json', 'w', encoding='utf-8') as f:
        json.dump(formatted_games, f, indent=4, ensure_ascii=False)
        
    print(f"\n成功保存了 {len(formatted_games)} 个游戏到 game.json")

if __name__ == "__main__":
    scrape_games()