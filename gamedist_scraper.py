import requests
import json
import time
import re
from tqdm import tqdm

class GameDistributionSimpleCrawler:
    def __init__(self):
        self.base_url = "https://catalog.api.gamedistribution.com/api/v1.0/rss/All/?collection=All&categories=All&tags=All&subType=All&type=All&mobile=All&rewarded=all&amount=100&page={}"
        self.output_json = "games.json"

    def slugify(self, text):
        """
        一个简单的函数，用于将文本转换为 URL 友好的 slug。
        """
        if not text:
            return ""
        text = text.lower()
        return re.sub(r'[^\w\s-]', '', text).strip().replace(' ', '-')

    def fetch_games(self, pages=5):
        """获取多页游戏数据"""
        all_games = []
        
        for page in range(1, pages + 1):
            try:
                print(f"正在获取第 {page}/{pages} 页游戏列表...")
                response = requests.get(self.base_url.format(page), timeout=15)
                
                if response.status_code == 200:
                    games = response.json()
                    all_games.extend(games)
                    print(f"第 {page} 页获取到 {len(games)} 个游戏")
                    
                    if page < pages:
                        time.sleep(1)
                else:
                    print(f"获取第 {page} 页失败: HTTP {response.status_code}")
                    break
                    
            except Exception as e:
                print(f"获取第 {page} 页时出错: {e}")
                continue
                
        return all_games
    
    def process_games(self, games):
        """处理游戏数据，使其符合 games.json 格式"""
        processed_games = []
        
        for game in tqdm(games, desc="处理游戏数据"):
            md5_hash = game.get('Md5')
            if not md5_hash:
                continue
            
            title = game.get('Title', '')
            game_slug = self.slugify(title)
            # 为了保证ID的唯一性，我们将MD5哈希的前6位附加到slug后面
            game_id = f"{game_slug}-{md5_hash[:6]}" if game_slug else md5_hash

            # API返回的Category和Tag都是列表
            categories = game.get('Category', [])
            tags = game.get('Tag', [])

            processed_games.append({
                "id": game_id,
                "title": title,
                "description": game.get('Description', ''),
                "icon": game.get('Asset', [''])[0] if game.get('Asset') and game.get('Asset')[0] else '',
                "gameUrl": f"https://html5.gamedistribution.com/{md5_hash}/",
                "categories": categories,
                "tags": tags
            })
                
        return processed_games
    
    def save_data(self, games):
        """保存游戏数据到JSON文件"""
        if not games:
            print("没有游戏数据可保存")
            return
            
        with open(self.output_json, 'w', encoding='utf-8') as f:
            json.dump(games, f, ensure_ascii=False, indent=4)
        
        print(f"成功保存 {len(games)} 个游戏数据到: {self.output_json}")
    
    def run(self, pages=5):
        """运行完整爬虫流程"""
        print(f"开始爬取 GameDistribution 游戏数据 ({pages} 页)...")
        
        games = self.fetch_games(pages)
        print(f"共获取到 {len(games)} 个游戏")
        
        if not games:
            print("未能获取到任何游戏数据，程序终止。")
            return

        processed_games = self.process_games(games)
        print(f"成功处理 {len(processed_games)}/{len(games)} 个游戏数据")
        
        self.save_data(processed_games)

if __name__ == "__main__":
    # 默认爬取3页游戏数据，大约300个游戏
    crawler = GameDistributionSimpleCrawler()
    crawler.run(pages=3) 