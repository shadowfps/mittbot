# Mittzocken Community Bot

Ein modularer Discord-Bot für die Community von mittzocken.de – mit modernen Features für Rollen, Vorschläge, Verifizierung und mehr!

---

## Features

- **Willkommensnachricht**: Sendet ein modernes Willkommens-Embed bei jedem neuen User.
- **Verifizierungssystem**: Slash-Command `/verifyembed` mit Button für automatische Rollenvergabe.
- **Rollen-Selfservice**: Slash-Command `/setup-roleselect` mit Multi-Select-Menü für Spiele-Rollen.
- **Vorschlags-/Eventsystem**: Slash-Command `/vorschlag` mit Modal für Events/Spiele. Community kann sich mit Buttons (Anmelden/Vielleicht/Abmelden) live am Embed eintragen.
- **MySQL-Datenbankanbindung**: Alle Vorschläge und Teilnehmer werden dauerhaft gespeichert.
- **Moderne Discord-UX**: Alles per Embed, Buttons, Selectmenus – keine Reactions nötig.

---

## Installation

1. **Bot und Abhängigkeiten installieren:**
   ```bash
   git clone <dein-repo-url>
   cd mittzocken-bot
   npm install
   ```

2. **.env Datei anlegen und befüllen:**
   ```
   DISCORD_TOKEN=DEIN_BOT_TOKEN
   CLIENT_ID=DEINE_CLIENT_ID
   VERIFY_CHANNEL=DISCORD_CHANNEL_ID
   VERIFY_ROLE=DISCORD_ROLE_ID
   WELCOME_CHANNEL=DISCORD_CHANNEL_ID
   ROLE_SETUP_CHANNEL=DISCORD_CHANNEL_ID

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=deinuser
   DB_PASSWORD=deinpasswort
   DB_NAME=deinedatenbank
   ```

3. **Bot starten:**
   ```
   npm start
   ```

---

## Slash-Befehle & Funktionen

### `/verifyembed`
Schickt ein Embed in den Verify-Channel (ID aus der .env), inklusive Button.  
**Funktion:** Klick auf den Button → User erhält automatisch die Verifizierungsrolle (ID aus .env).

---

### `/setup-roleselect`
Postet ein Embed mit Select-Menü zum Self-Assign für folgende Spiele-Rollen (Mehrfachauswahl möglich):

- League of Legends
- Rainbow Six
- Warzone
- Minecraft
- Counter Strike
- GTA5
- Hunt: Showdown
- Rocket League
- Valorant
- World of Warcraft
- Random Tabletop

**Funktion:**  
Einfach gewünschte(n) Spiel(e) auswählen, Bot vergibt die passenden Rollen!

---

### `/vorschlag`
Öffnet ein Modal mit drei Feldern:

- **Spiel**: (Text)
- **Uhrzeit/Datum**: (Text)
- **Vorschlag**: (Text, groß)

**Nach Absenden:**
- Vorschlag wird als Embed (inkl. Ersteller-Mention und Vorschlags-ID) im Channel gepostet und die Rolle <@&1384251875259584563> wird gepingt.
- Drei Buttons am Embed:
    - **Anmelden**
    - **Vielleicht**
    - **Abmelden**

**Wer auf einen Button klickt, erscheint live als Mention unter dem jeweiligen Punkt im Embed und wird in der Datenbank gespeichert!**

---

## Hinweise

- **Bot benötigt in Discord:**  
  - Nachrichten schreiben & bearbeiten  
  - Nachrichten von Webhooks  
  - Rollen verwalten  
  - `@Rollen` erwähnen (bitte für <@&1384251875259584563> im Discord erlauben!)

- **MySQL-Datenbank:**  
  - Tabellen: `suggestions`, `suggestion_participants`  
  - Siehe SQL-Beispiel im Projekt, falls du manuell einrichten willst

---

## Weiterentwicklung

- Weitere Slash-Commands & Buttons können in den Ordnern `/commands` und `/handler` sehr einfach ergänzt werden.
- Der Bot ist auf Skalierbarkeit und moderne Discord-UX ausgelegt.

---

**Viel Spaß mit dem mittzocken Community Bot!**  
Fragen? Melde dich gerne bei [Ruben Riesen](https://mittzocken.de) oder im Discord!
