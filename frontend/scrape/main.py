import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from supabase import create_client



def main():
    teams = [
    ["Duke", "https://www.espn.com/mens-college-basketball/team/stats/_/id/150/duke-blue-devils"], 
    ["Siena", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2561/siena-saints"], 
    ["Ohio State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/194/ohio-state-buckeyes"], 
    ["TCU", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2628/tcu-horned-frogs"], 
    ["St. Johns'", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2599/st-john-red-storm"], 
    ["Northern Iowa", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2460/northern-iowa-panthers"], 
    ["Kansas", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2305/kansas-jayhawks"], 
    ["Cal Baptist", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2856"], 
    ["Louisville", "https://www.espn.com/mens-college-basketball/team/stats/_/id/97/louisville-cardinals"], 
    ["South Florida", "https://www.espn.com/mens-college-basketball/team/stats/_/id/58/south-florida-bulls"], 
    ["Michigan State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/127/michigan-state-spartans"], 
    ["North Dakota State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2449/north-dakota-state-bison"], 
    ["UCLA", "https://www.espn.com/mens-college-basketball/team/stats/_/id/26/ucla-bruins"], 
    ["UCF", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2116/ucf-knights"], 
    ["UConn", "https://www.espn.com/mens-college-basketball/team/stats/_/id/41/uconn-huskies"], 
    ["Furman", "https://www.espn.com/mens-college-basketball/team/stats/_/id/231/furman-paladins"],
    ["Arizona", "https://www.espn.com/mens-college-basketball/team/stats/_/id/12/arizona-wildcats"], 
    ["LIU", "https://www.espn.com/mens-college-basketball/team/stats/_/id/112/liu-sharks"], 
    ["Villanova", "https://www.espn.com/mens-college-basketball/team/stats/_/id/222/villanova-wildcats"], 
    ["Utah State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/328/utah-state-aggies"], 
    ["Wisconsin", "https://www.espn.com/mens-college-basketball/team/stats/_/id/275/wisconsin-badgers"], 
    ["High Point", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2272/high-point-panthers"], 
    ["Arkansas", "https://www.espn.com/mens-college-basketball/team/stats/_/id/8/arkansas-razorbacks"], 
    ["Hawaii", "https://www.espn.com/mens-college-basketball/team/stats/_/id/62/hawaii-rainbow-warriors"], 
    ["BYU", "https://www.espn.com/mens-college-basketball/team/stats/_/id/252/byu-cougars"], 
    ["NC State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/152/nc-state-wolfpack"], 
    ["Texas", "https://www.espn.com/mens-college-basketball/team/stats/_/id/251/texas-longhorns"], 
    ["Gonzaga", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2250/gonzaga-bulldogs"], 
    ["Kennesaw State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2316/kennesaw-state-owls"], 
    ["Miami (FL)", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2390/miami-hurricanes"], 
    ["Missouri", "https://www.espn.com/mens-college-basketball/team/stats/_/id/142/missouri-tigers"], 
    ["Purdue", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2509/purdue-boilermakers"],
    ["Queens (NC)", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2511"],
    ["Florida", "https://www.espn.com/mens-college-basketball/team/stats/_/id/57/florida-gators"], 
    ["Prairie View A&M", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2504/prairie-view-am-panthers"], 
    ["Lehigh", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2329/lehigh-mountain-hawks"], 
    ["Clemson", "https://www.espn.com/mens-college-basketball/team/stats/_/id/228/clemson-tigers"], 
    ["Iowa", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2294/iowa-hawkeyes"], 
    ["Vanderbilt", "https://www.espn.com/mens-college-basketball/team/stats/_/id/238/vanderbilt-commodores"], 
    ["McNeese", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2377/mcneese-cowboys"], 
    ["Nebraska", "https://www.espn.com/mens-college-basketball/team/stats/_/id/158/nebraska-cornhuskers"], 
    ["Troy", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2653/troy-trojans"], 
    ["North Carolina", "https://www.espn.com/mens-college-basketball/team/stats/_/id/153/north-carolina-tar-heels"], 
    ["VCU", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2670/vcu-rams"], 
    ["Illinois", "https://www.espn.com/mens-college-basketball/team/stats/_/id/356/illinois-fighting-illini"], 
    ["Penn", "https://www.espn.com/mens-college-basketball/team/stats/_/id/248/pennsylvania-quakers"], 
    ["St. Mary's", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2608/saint-marys-gaels"], 
    ["Texas A&M", "https://www.espn.com/mens-college-basketball/team/stats/_/id/245/texas-am-aggies"], 
    ["Houston", "https://www.espn.com/mens-college-basketball/team/stats/_/id/248/houston-cougars"], 
    ["Idaho", "https://www.espn.com/mens-college-basketball/team/stats/_/id/70/idaho-vandals"],
    ["Michigan", "https://www.espn.com/mens-college-basketball/team/stats/_/id/130/michigan-wolverines"],
    ["Howard", "https://www.espn.com/mens-college-basketball/team/stats/_/id/47/howard-bison"], 
    ["UMBC", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2349/umbc-retrievers"], 
    ["Georgia", "https://www.espn.com/mens-college-basketball/team/stats/_/id/61/georgia-bulldogs"], 
    ["Saint Louis", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2550/saint-louis-billikens"], 
    ["Texas Tech", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2641/texas-tech-red-raiders"], 
    ["Akron", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2006/akron-zips"], 
    ["Alabama", "https://www.espn.com/mens-college-basketball/team/stats/_/id/333/alabama-crimson-tide"], 
    ["Hofstra", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2275/hofstra-pride"], 
    ["Tennessee", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2633/tennessee-volunteers"], 
    ["SMU", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2567/smu-mustangs"], 
    ["Miami (OH)", "https://www.espn.com/mens-college-basketball/team/stats/_/id/193/miami-oh-redhawks"], 
    ["Virginia", "https://www.espn.com/mens-college-basketball/team/stats/_/id/258/virginia-cavaliers"], 
    ["Wright St.", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2751/wright-state-raiders"],
    ["Kentucky", "https://www.espn.com/mens-college-basketball/team/stats/_/id/96/kentucky-wildcats"], 
    ["Santa Clara", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2540/santa-clara-broncos"], 
    ["Iowa State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/66/iowa-state-cyclones"], 
    ["Tennessee State", "https://www.espn.com/mens-college-basketball/team/stats/_/id/2634/tennessee-state-tigers"]
    ]
    
    for team in teams:
        
        # Query teams table
        team_response = (
            supabase.table("teams")
            .select("id")
            .eq("name", team[0])
            .execute()
        )
        
        team_id = team_response.data[0]["id"]

        player_data = scrape(team[1])
        
        formatted_player_data = []
        for player, stats in player_data.items():
            row = {
                "player_name": player,
                "team_id": team_id,
            }
            row.update(stats)
            formatted_player_data.append(row)
        
        try:
            response = (
                supabase.table("players")
                .insert(formatted_player_data)
                .execute()
            )
        
            print(f"Successfully inserted rows for team {response.data[0]["team_id"]}")
        except Exception as exception:
            print(exception)
        

    
    
def scrape(url): 
    # 1. The URL we want to scrape
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check if the request was successful

        # 3. Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        headers = []  # The first table only has "Name"
        idx = 0
        header_tags = soup.find_all('th', class_='stats-cell')
        for i in range(len(header_tags)):
            header = header_tags[i].text.strip();
            if idx < 11:
                headers.append(f"Individual_{header}")
            else:
                headers.append(f"Season_{header}")
            idx += 1

        # print(f"Headers: {headers}")
        # print("-" * 30)

        # 2. Extract Names (from the first table)
        # We look for the anchor links within the playerCell spans
        players = {}
        player_cells = soup.find_all('span', attrs={'data-testid': 'playerCell'})
        for cell in player_cells:
            name_link = cell.find('a')
            if name_link:
                name = name_link.text.strip()
                players[name] = {}
                for i in range(len(headers)):
                    players[name][headers[i]] = 0
        
        player_names = list(players.keys())


        tables = soup.find_all('div', attrs={'class': 'Table__Scroller' })
        
        individual_stats = tables[0].find('tbody').find_all('tr')
        individual_stats.pop()
        
        season_total = tables[1].find('tbody').find_all('tr')
        season_total.pop()
        stat_rows = soup.find('div', class_='Table__Scroller').find('tbody').find_all('tr')

        idx = 0    
        for row in individual_stats:
            # Get all stat cells (span with data-testid="statCell") in this row
            cells = row.find_all('span', attrs={'data-testid': 'statCell'})
            row_data = [c.text.strip() for c in cells]
            
            for j in range(0,11):
                players[player_names[idx]][headers[j]] = float(row_data[j])
            idx += 1
        

        idx = 0
        for row in season_total:
            # Get all stat cells (span with data-testid="statCell") in this row
            cells = row.find_all('span', attrs={'data-testid': 'statCell'})
            row_data = [c.text.strip() for c in cells]
            
            for j in range(11, len(headers)):
                players[player_names[idx]][headers[j]] = float(row_data[j-11])
            idx += 1


        return players
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        

if __name__ == "__main__":
    load_dotenv()
    
    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

    supabase = create_client(url, key)
    main()
    
    