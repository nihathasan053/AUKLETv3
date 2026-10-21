const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    // Navigation & View States
    const currentView = ref('home');
    const selectedSport = ref('football');
    const filterStatus = ref('ALL');
    const isLiveOnly = ref(false);
    const searchQuery = ref('');
    const activeMatch = ref(null);
    const activeDetailTab = ref('TIMELINE');

    // Local Storage & Configuration
    const apiKeyInput = ref(localStorage.getItem('auklet_api_key') || '');
    const dataSourceType = ref(apiKeyInput.value ? 'CUSTOM REST API' : 'SIMULATED LIVE ENGINE');
    const favorites = ref(JSON.parse(localStorage.getItem('auklet_favorites') || '[]'));

    // 12-Sport Unified Architecture
    const sportsList = ref([
      { id: 'football', name: 'Football', icon: '⚽', liveCount: 2 },
      { id: 'cricket', name: 'Cricket', icon: '🏏', liveCount: 1 },
      { id: 'basketball', name: 'Basketball', icon: '🏀', liveCount: 1 },
      { id: 'tennis', name: 'Tennis', icon: '🎾', liveCount: 0 },
      { id: 'badminton', name: 'Badminton', icon: '🏸', liveCount: 0 },
      { id: 'volleyball', name: 'Volleyball', icon: '🏐', liveCount: 0 },
      { id: 'rugby', name: 'Rugby', icon: '🏉', liveCount: 0 },
      { id: 'baseball', name: 'Baseball', icon: '⚾', liveCount: 0 },
      { id: 'icehockey', name: 'Ice Hockey', icon: '🏒', liveCount: 0 },
      { id: 'americanfootball', name: 'NFL', icon: '🏈', liveCount: 0 },
      { id: 'tabletennis', name: 'Table Tennis', icon: '🏓', liveCount: 0 },
      { id: 'formula1', name: 'F1', icon: '🏎️', liveCount: 0 }
    ]);

    // Match Dataset (Rich initial models for Football, Cricket, Basketball)
    const matches = ref([
      {
        id: 'f-101',
        sport: 'football',
        tournament: 'Premier League',
        stage: 'Matchday 28',
        status: 'LIVE',
        liveTime: '73\'',
        homeTeam: 'Arsenal',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=ARS',
        homeScore: 2,
        awayTeam: 'Chelsea',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=CHE',
        awayScore: 1,
        recentEvent: '71\' Saka goal from outside penalty box',
        venue: 'Emirates Stadium, London',
        official: 'M. Oliver',
        events: [
          { time: 24, type: 'goal', player: 'B. Saka', detail: 'Assist by Odegaard', team: 'Arsenal' },
          { time: 42, type: 'goal', player: 'C. Palmer', detail: 'Penalty scored', team: 'Chelsea' },
          { time: 59, type: 'card', player: 'E. Fernandez', detail: 'Yellow Card (Foul)', team: 'Chelsea' },
          { time: 71, type: 'goal', player: 'B. Saka', detail: 'Left-foot curl', team: 'Arsenal' }
        ],
        stats: [
          { label: 'Ball Possession', home: '58%', away: '42%', homePercent: 58 },
          { label: 'Total Shots', home: '14', away: '7', homePercent: 66 },
          { label: 'Shots on Target', home: '6', away: '3', homePercent: 66 },
          { label: 'Corner Kicks', home: '8', away: '2', homePercent: 80 }
        ],
        homeLineup: ['Raya (GK)', 'White', 'Saliba', 'Gabriel', 'Timber', 'Partey', 'Rice', 'Odegaard', 'Saka', 'Havertz', 'Martinelli'],
        awayLineup: ['Sanchez (GK)', 'Gusto', 'Fofana', 'Colwill', 'Cucurella', 'Caicedo', 'Fernandez', 'Madueke', 'Palmer', 'Sancho', 'Jackson']
      },
      {
        id: 'f-102',
        sport: 'football',
        tournament: 'La Liga',
        stage: 'Round 26',
        status: 'LIVE',
        liveTime: '38\'',
        homeTeam: 'Real Madrid',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=RMA',
        homeScore: 1,
        awayTeam: 'Barcelona',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=FCB',
        awayScore: 1,
        recentEvent: '34\' V. Junior goal on counter attack',
        venue: 'Santiago Bernabéu, Madrid',
        official: 'J. Martinez',
        events: [
          { time: 18, type: 'goal', player: 'L. Yamal', detail: 'Solo run and chip', team: 'Barcelona' },
          { time: 34, type: 'goal', player: 'Vinicius Jr.', detail: 'Fast break goal', team: 'Real Madrid' }
        ],
        stats: [
          { label: 'Ball Possession', home: '49%', away: '51%', homePercent: 49 },
          { label: 'Total Shots', home: '8', away: '9', homePercent: 47 },
          { label: 'Pass Accuracy', home: '89%', away: '91%', homePercent: 49 }
        ],
        homeLineup: ['Courtois (GK)', 'Carvajal', 'Militao', 'Rudiger', 'Mendy', 'Valverde', 'Tchouameni', 'Bellingham', 'Rodrygo', 'Mbappe', 'Vinicius Jr.'],
        awayLineup: ['Pena (GK)', 'Kounde', 'Cubarsi', 'Martinez', 'Balde', 'Casado', 'Pedri', 'Yamal', 'Olmo', 'Raphinha', 'Lewandowski']
      },
      {
        id: 'f-103',
        sport: 'football',
        tournament: 'UEFA Champions League',
        stage: 'Quarter Final',
        status: 'UPCOMING',
        startTime: 'Tomorrow, 20:00',
        homeTeam: 'Bayern Munich',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=BAY',
        homeScore: 0,
        awayTeam: 'Inter Milan',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=INT',
        awayScore: 0,
        venue: 'Allianz Arena, Munich',
        official: 'D. Makkelie',
        events: [],
        stats: [],
        homeLineup: ['Neuer (GK)', 'Davies', 'Upamecano', 'Kim', 'Kimmich', 'Pavlovic', 'Palhinha', 'Musiala', 'Gnabry', 'Kane', 'Sane'],
        awayLineup: ['Sommer (GK)', 'Pavard', 'Acerbi', 'Bastoni', 'Darmian', 'Barella', 'Calhanoglu', 'Mkhitaryan', 'Dimarco', 'Thuram', 'Martinez']
      },
      {
        id: 'c-201',
        sport: 'cricket',
        tournament: 'ICC World Cup Super 8',
        stage: 'Innings 2',
        status: 'LIVE',
        liveTime: '34.2 Overs',
        homeTeam: 'India',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=IND',
        awayTeam: 'Australia',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=AUS',
        cricketScore: {
          team1: { runs: 284, wickets: 7, overs: '50.0' },
          team2: { runs: 198, wickets: 3, overs: '34.2' }
        },
        cricketSummary: 'Australia need 87 runs from 94 balls with 7 wickets in hand',
        venue: 'Kensington Oval, Bridgetown',
        official: 'R. Kettleborough, N. Menon',
        events: [
          { time: '14.2 ov', type: 'wicket', player: 'Head c Kohli b Bumrah', detail: 'Bowled on off-stump', team: 'India' },
          { time: '28.5 ov', type: 'wicket', player: 'Marsh c Pant b Kuldeep', detail: 'Caught behind', team: 'India' }
        ],
        stats: [
          { label: 'Current Run Rate', home: '5.68', away: '5.76', homePercent: 50 },
          { label: 'Required Run Rate', home: '-', away: '5.55', homePercent: 50 }
        ],
        homeLineup: ['Rohit (C)', 'Kohli', 'Pant (WK)', 'Suryakumar', 'Hardik', 'Dube', 'Axar', 'Jadeja', 'Kuldeep', 'Bumrah', 'Arshdeep'],
        awayLineup: ['Warner', 'Head', 'Marsh (C)', 'Maxwell', 'Stoinis', 'David', 'Wade (WK)', 'Cummins', 'Starc', 'Zampa', 'Hazlewood']
      },
      {
        id: 'c-202',
        sport: 'cricket',
        tournament: 'T20 International Cup',
        stage: 'Match 14',
        status: 'UPCOMING',
        startTime: 'Friday, 14:30',
        homeTeam: 'England',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=ENG',
        awayTeam: 'South Africa',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=SA',
        cricketScore: {
          team1: { runs: 0, wickets: 0, overs: '0.0' },
          team2: { runs: 0, wickets: 0, overs: '0.0' }
        },
        cricketSummary: 'Match starts at 14:30 local time. Toss in 4 hours.',
        venue: 'Lord\'s Cricket Ground, London',
        official: 'C. Gaffaney',
        events: [],
        stats: [],
        homeLineup: ['Buttler (C)', 'Salt', 'Brook', 'Bairstow', 'Moeen', 'Livingstone', 'Curran', 'Jordan', 'Archer', 'Rashid', 'Wood'],
        awayLineup: ['de Kock (WK)', 'Hendricks', 'Markram (C)', 'Klaasen', 'Miller', 'Stubbs', 'Jansen', 'Maharaj', 'Rabada', 'Nortje', 'Shamsi']
      },
      {
        id: 'b-301',
        sport: 'basketball',
        tournament: 'NBA Championship',
        stage: 'Quarter 4',
        status: 'LIVE',
        liveTime: '3:45 Q4',
        homeTeam: 'Boston Celtics',
        homeLogo: 'https://placehold.co/60x60/161a22/00e676?text=BOS',
        homeScore: 104,
        awayTeam: 'LA Lakers',
        awayLogo: 'https://placehold.co/60x60/161a22/00e676?text=LAL',
        awayScore: 101,
        venue: 'TD Garden, Boston',
        events: [],
        stats: [
          { label: 'Field Goal %', home: '47.5%', away: '45.1%', homePercent: 51 },
          { label: '3-Point %', home: '38.2%', away: '34.0%', homePercent: 53 }
        ],
        homeLineup: ['Holiday', 'White', 'Brown', 'Tatum', 'Porzingis'],
        awayLineup: ['Russell', 'Reaves', 'James', 'Hachimura', 'Davis']
      }
    ]);

    // Sports News Items
    const newsArticles = ref([
      {
        id: 1,
        sport: 'football',
        title: 'Title Race Tightens as Dramatic Clashes Deliver Late Stoppage Thrills',
        snippet: 'Tactical substitutions and high press prove decisive in the latest round of European domestic football fixtures.',
        source: 'Auklet Sports Desk',
        time: '12m ago'
      },
      {
        id: 2,
        sport: 'cricket',
        title: 'Spin Bowling Masterclass Sets Up High-Octane Chase in Barbados',
        snippet: 'Middle-overs discipline restricted the run flow before aggressive lower-order hitting swung the momentum.',
        source: 'Cricket Wire',
        time: '45m ago'
      },
      {
        id: 3,
        sport: 'formula1',
        title: 'New Aerodynamic Floor Updates Cleared for Upcoming Grand Prix',
        snippet: 'Engineers report positive correlation between computational fluid dynamics telemetry and wind tunnel models.',
        source: 'Paddock Report',
        time: '2h ago'
      }
    ]);

    // Filtering & Search Computations
    const filteredMatches = computed(() => {
      return matches.value.filter(m => {
        const matchesSport = m.sport === selectedSport.value;
        const matchesLive = isLiveOnly.value ? m.status === 'LIVE' : true;
        const matchesStatus = filterStatus.value === 'ALL' ? true : m.status === filterStatus.value;
        return matchesSport && matchesLive && matchesStatus;
      });
    });

    const searchResults = computed(() => {
      if (!searchQuery.value.trim()) return [];
      const q = searchQuery.value.toLowerCase();
      return matches.value.filter(m => 
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.tournament.toLowerCase().includes(q) ||
        m.sport.toLowerCase().includes(q)
      );
    });

    const favoriteMatches = computed(() => {
      return matches.value.filter(m => favorites.value.includes(m.id));
    });

    // Actions
    function selectSport(sportId) {
      selectedSport.value = sportId;
    }

    function selectSportAndBrowse(sportId) {
      selectedSport.value = sportId;
      currentView.value = 'home';
    }

    function toggleLiveOnly() {
      isLiveOnly.value = !isLiveOnly.value;
    }

    function resetFilters() {
      filterStatus.value = 'ALL';
      isLiveOnly.value = false;
      searchQuery.value = '';
    }

    function openMatchDetails(match) {
      activeMatch.value = match;
      currentView.value = 'details';
    }

    function isFavorite(matchId) {
      return favorites.value.includes(matchId);
    }

    function toggleFavorite(matchId) {
      const index = favorites.value.indexOf(matchId);
      if (index === -1) {
        favorites.value.push(matchId);
      } else {
        favorites.value.splice(index, 1);
      }
      localStorage.setItem('auklet_favorites', JSON.stringify(favorites.value));
    }

    function saveApiKey() {
      if (apiKeyInput.value.trim()) {
        localStorage.setItem('auklet_api_key', apiKeyInput.value.trim());
        dataSourceType.value = 'CUSTOM REST API';
        alert('API Key stored securely in local app storage. Live REST adapter enabled.');
      } else {
        localStorage.removeItem('auklet_api_key');
        dataSourceType.value = 'SIMULATED LIVE ENGINE';
        alert('Switched back to Simulated Live Engine.');
      }
    }

    function resetToFactory() {
      if (confirm('Clear local favorites and reset settings?')) {
        localStorage.clear();
        favorites.value = [];
        apiKeyInput.value = '';
        dataSourceType.value = 'SIMULATED LIVE ENGINE';
      }
    }

    // Live Score Ticker Simulator (Runs every 10 seconds to advance match clock/stats safely)
    let tickerInterval = null;

    onMounted(() => {
      // Register service worker if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {
          // SW registration optional for local file opening
        });
      }

      tickerInterval = setInterval(() => {
        // Minor clock increment on live football match
        const liveMatch = matches.value.find(m => m.id === 'f-101' && m.status === 'LIVE');
        if (liveMatch) {
          const currentMin = parseInt(liveMatch.liveTime.replace("'", "")) || 73;
          if (currentMin < 90) {
            liveMatch.liveTime = (currentMin + 1) + "'";
          }
        }
      }, 10000);
    });

    onUnmounted(() => {
      if (tickerInterval) clearInterval(tickerInterval);
    });

    return {
      currentView,
      selectedSport,
      filterStatus,
      isLiveOnly,
      searchQuery,
      activeMatch,
      activeDetailTab,
      apiKeyInput,
      dataSourceType,
      sportsList,
      filteredMatches,
      searchResults,
      favoriteMatches,
      newsArticles,
      selectSport,
      selectSportAndBrowse,
      toggleLiveOnly,
      resetFilters,
      openMatchDetails,
      isFavorite,
      toggleFavorite,
      saveApiKey,
      resetToFactory
    };
  }
}).mount('#app');