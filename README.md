# NutriCoach React App

Eine moderne React-App für Ernährungscoaching und Mahlzeitenverfolgung mit mehrsprachiger Unterstützung.

## Funktionen

- **Personalisiertes Ernährungscoaching**: Erhalte Tipps und Anleitungen von einem virtuellen Coach.
- **Mehrsprachige Benutzeroberfläche**: Unterstützung für Deutsch, Englisch und Albanisch.
- **Mahlzeitenverfolgung**: Plane und verfolge deine täglichen Mahlzeiten.
- **Fortschrittsvisualisierung**: Verfolge deine Ernährungs- und Gewichtsziele visuell.
- **Rezeptbibliothek**: Durchsuche und speichere gesunde Rezepte.
- **Onboarding-Prozess**: Personalisierte Einrichtung basierend auf deinen Zielen und Vorlieben.
- **Gamification**: Verdiene Abzeichen und schließe Herausforderungen ab, um motiviert zu bleiben.

## Technologien

- React mit TypeScript
- React Router für die Navigation
- Chakra UI für das Design-System
- Framer Motion für Animationen
- i18next für Internationalisierung
- LocalStorage und IndexedDB für die Datenpersistenz

## Installation

1. Klone das Repository:
   ```
   git clone https://github.com/yourusername/nutricoach-react.git
   ```

2. Installiere die Abhängigkeiten:
   ```
   cd nutricoach-react
   npm install
   ```

3. Starte die Anwendung:
   ```
   npm start
   ```

4. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Projektstruktur

- **components/**: Wiederverwendbare UI-Komponenten
  - **common/**: Gemeinsame Komponenten wie Header, Navigation, Layout
  - **coach/**: Komponenten für den virtuellen Coach
  - **meals/**: Komponenten für die Mahlzeitenverfolgung
  - **progress/**: Komponenten für die Fortschrittsvisualisierung
  - **gamification/**: Komponenten für Gamification-Elemente
- **contexts/**: React Context-Provider für den Anwendungszustand
- **pages/**: Hauptseiten der Anwendung
- **data/**: Mock-Daten und Datenmodelle
- **services/**: Dienste für API-Aufrufe und Datenverarbeitung
- **types/**: TypeScript-Typendefinitionen
- **hooks/**: Benutzerdefinierte React-Hooks
- **utils/**: Hilfsfunktionen und Dienstprogramme
- **locales/**: Übersetzungsdateien für verschiedene Sprachen

## Implementierte Funktionen

### Rezepte-Modul
- **Rezeptübersicht**: Durchsuche und filtere Rezepte nach Kategorien
- **Rezeptdetails**: Zeige detaillierte Informationen zu Rezepten an, einschließlich Zutaten und Anweisungen
- **Favoriten**: Speichere Rezepte als Favoriten
- **Essensplan**: Füge Rezepte zum Essensplan hinzu

### Mahlzeiten-Modul
- **Essensplan-Ansicht**: Plane deine Mahlzeiten für verschiedene Tage
- **Mahlzeitentypen**: Organisiere deinen Essensplan nach Frühstück, Mittagessen, Abendessen und Snacks

## Unterstützte Sprachen

- Deutsch
- Englisch
- Albanisch

## Lizenz

MIT 