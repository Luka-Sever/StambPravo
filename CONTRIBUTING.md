# Doprinos projektu StanPlan

Hvala vam na interesu za doprinos StanPlan projektu!  Ovaj dokument pruža smjernice kako možete pomoći u razvoju aplikacije za rješavanje pravnih odnosa vezanih za stambene ustanove.

## Sadržaj

- [Kako početi](#kako-početi)
- [Načini doprinosa](#načini-doprinosa)
- [Razvojno okruženje](#razvojno-okruženje)
- [Proces rada](#proces-rada)
- [Standardi kodiranja](#standardi-kodiranja)
- [Prijava grešaka](#prijava-grešaka)
- [Predlaganje novih funkcionalnosti](#predlaganje-novih-funkcionalnosti)
- [Pull Request proces](#pull-request-proces)
- [Komunikacija](#komunikacija)
- [Kodeks ponašanja](#kodeks-ponašanja)

## Kako početi

1. **Forkajte repozitorij** - Kliknite na "Fork" gumb na GitHub stranici projekta
2. **Klonirajte fork** na svoje lokalno računalo: 
   ```bash
   git clone https://github.com/vase-korisnicko-ime/StanPlan.git
   cd StanPlan
   ```
3. **Dodajte upstream repozitorij**:
   ```bash
   git remote add upstream https://github.com/Pcelicee/StanPlan.git
   ```
4. **Kreirajte novu granu** za vaše izmjene:
   ```bash
   git checkout -b feature/ime-vase-funkcionalnosti
   ```

## Načini doprinosa

Postoji mnogo načina da doprinesete projektu: 

### Kod
- Implementacija novih funkcionalnosti
- Ispravljanje grešaka (bugova)
- Poboljšanje performansi
- Refaktoriranje postojećeg koda
- Pisanje testova

### Dokumentacija
- Opis i analiza sustava i tehnologije u aplikaciji
- Dodavanje komentara u kodu

### Testiranje
- Prijavljivanje grešaka
- Testiranje novih funkcionalnosti
- Verifikacija ispravaka

### Ideje
- Predlaganje novih funkcionalnosti
- Sudjelovanje u raspravama
- Davanje povratnih informacija

## Razvojno okruženje

### Preduvjeti

- **Java**:  JDK 11 ili noviji
- **Node.js**:  verzija 14 ili novija
- **npm** ili **yarn**
- **Docker**
- **Git**

### Postavljanje projekta

1. **Backend (Java)**:
   ```bash
   # Navigirajte do backend direktorija
   cd backend
   
   # Instalirajte ovisnosti (Maven)
   mvn clean install
   
   # Pokrenite aplikaciju
   mvn spring-boot:run
   ```

2. **Frontend (JavaScript)**:
   ```bash
   # Navigirajte do frontend direktorija
   cd frontend
   
   # Instalirajte ovisnosti
   npm install
   
   # Pokrenite razvojni server
   npm run dev
   ```

3. **Docker (opcionalno)**:
   ```bash
   # Pokrenite cijelu aplikaciju s Docker Compose
   docker-compose up --build
   ```

## Proces rada

1. **Sinkronizirajte vaš fork** s upstream repozitorijem: 
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Kreirajte novu granu** za svaku novu funkcionalnost ili ispravak:
   ```bash
   git checkout -b feature/opisni-naziv-funkcionalnosti
   # ili
   git checkout -b fix/opisni-naziv-ispravka
   ```

3. **Commitajte promjene** s jasnim porukama:
   ```bash
   git add .
   git commit -m "feat: dodavanje funkcionalnosti za upravljanje stanovima"
   ```

4. **Pushajte promjene** na vaš fork:
   ```bash
   git push origin feature/ime-vase-funkcionalnosti
   ```

5. **Otvorite Pull Request** na glavnom repozitoriju

## Standardi kodiranja

Molimo vas da se pridržavate postojećih standarda i stila kodiranja koji su već uspostavljeni u projektu.  Pregledajte postojeće datoteke u repozitoriju kako biste vidjeli konvencije imenovanja, formatiranje i strukturu koda za backend i frontend dijelove aplikacije.

## Prijava grešaka

Prije nego što prijavite grešku, molimo vas da:

1. **Provjerite postojeće issue-e** da vidite je li greška već prijavljena
2. **Koristite najnoviju verziju** projekta
3. **Prikupite relevantne informacije**:
   - Koraci za reprodukciju greške
   - Očekivano ponašanje
   - Trenutno ponašanje
   - Verzija operativnog sustava
   - Verzija Jave i Node.js-a
   - Snimke zaslona ili logovi (ako je moguće)

## Predlaganje novih funkcionalnosti

Prije nego što predložite novu funkcionalnost:

1. **Provjerite postoji li već** sličan feature request
2. **Razmislite o upotrebljivosti** - je li funkcionalnost relevantna za većinu korisnika? 
3. **Kreirajte detaljan opis**: 
   - Problem koji rješava
   - Predloženo rješenje
   - Alternative koje ste razmotrili
   - Dodatni kontekst

## Pull Request proces

### Prije nego što pošaljete PR

Provjerite sljedeće:

- Vaš kod se kompajlira bez grešaka
- Svi testovi prolaze (`mvn test` ili `npm test`)
- Dodali ste testove za novu funkcionalnost (ako je primjenjivo)
- Ažurirali ste dokumentaciju (ako je potrebno)
- Vaš kod prati standarde kodiranja projekta
- Commit poruke su jasne i opisne

## Komunikacija

- **GitHub Issues**: Za prijavljivanje grešaka i predlaganje funkcionalnosti
- **GitHub Discussions**: Za opće rasprave i pitanja
- **Pull Requests**:  Za code review i tehničke rasprave

## Kodeks ponašanja

Ovaj projekt pridržava se [Kodeksa ponašanja](CODE_OF_CONDUCT.md). Sudjelovanjem se očekuje da ćete poštovati ovaj kodeks.  Molimo prijavite neprihvatljivo ponašanje maintainerima projekta.

## Hvala!

Svaki doprinos, bez obzira koliko je mali, značajan je i cijenjen. Hvala vam što pomažete da StanPlan bude bolji! 

---

**Pitanja?** Slobodno otvorite issue s oznakom `question` ili kontaktirajte maintainere projekta. 
