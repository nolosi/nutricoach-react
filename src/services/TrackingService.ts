/**
 * Service für die Verfolgung und Speicherung der historischen Daten verschiedener Metriken
 */

// Modelle für historische Daten
export interface MetricEntry {
  date: string;
  value: number;
  note?: string;
}

export interface TrackingData {
  caloriesHistory: MetricEntry[];
  proteinHistory: MetricEntry[];
  waterHistory: MetricEntry[];
}

class TrackingService {
  /**
   * Aktualisiert die Metrik für das aktuelle Datum
   */
  updateMetric(
    user: any,
    updateUser: (user: any) => void,
    metricType: 'calories' | 'protein' | 'water',
    value: number,
    note?: string,
    date?: string
  ): void {
    if (!user) return;
    
    console.log(`TrackingService: Aktualisiere ${metricType} mit Wert ${value}`, { date, note });
    
    // Verwende das aktuelle Datum, wenn keines angegeben ist
    const entryDate = date || new Date().toISOString().split('T')[0];
    
    // Kopiere die aktuelle Historie der angegebenen Metrik
    let historyArray: MetricEntry[] = [];
    
    switch (metricType) {
      case 'calories':
        historyArray = [...(user.caloriesHistory || [])];
        break;
      case 'protein':
        historyArray = [...(user.proteinHistory || [])];
        break;
      case 'water':
        historyArray = [...(user.waterHistory || [])];
        break;
      default:
        return;
    }
    
    // Prüfe, ob es bereits einen Eintrag für das angegebene Datum gibt
    const existingEntryIndex = historyArray.findIndex(entry => entry.date === entryDate);
    
    console.log(`TrackingService: Für ${metricType} besteht ${existingEntryIndex >= 0 ? 'bereits ein Eintrag' : 'noch kein Eintrag'} für das Datum ${entryDate}`);
    
    if (existingEntryIndex >= 0) {
      // Aktualisiere den bestehenden Eintrag
      const oldValue = historyArray[existingEntryIndex].value;
      historyArray[existingEntryIndex] = {
        ...historyArray[existingEntryIndex],
        value,
        note: note || historyArray[existingEntryIndex].note
      };
      console.log(`TrackingService: Wert für ${metricType} von ${oldValue} auf ${value} aktualisiert`);
    } else {
      // Füge einen neuen Eintrag hinzu
      historyArray.push({
        date: entryDate,
        value,
        note
      });
      console.log(`TrackingService: Neuer Eintrag für ${metricType} mit Wert ${value} hinzugefügt`);
    }
    
    // Sortiere die Historie nach Datum (neueste zuerst)
    historyArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Aktualisiere den Benutzer mit der neuen Historie
    switch (metricType) {
      case 'calories':
        updateUser({ ...user, caloriesHistory: historyArray });
        break;
      case 'protein':
        updateUser({ ...user, proteinHistory: historyArray });
        break;
      case 'water':
        updateUser({ ...user, waterHistory: historyArray });
        break;
    }
  }
  
  /**
   * Ruft die Historie für eine bestimmte Metrik ab
   */
  getMetricHistory(
    user: any,
    metricType: 'calories' | 'protein' | 'water'
  ): MetricEntry[] {
    if (!user) return [];
    
    switch (metricType) {
      case 'calories':
        return user.caloriesHistory || [];
      case 'protein':
        return user.proteinHistory || [];
      case 'water':
        return user.waterHistory || [];
      default:
        return [];
    }
  }
  
  /**
   * Berechnet den Durchschnitt einer Metrik über einen bestimmten Zeitraum
   */
  getMetricAverage(
    user: any,
    metricType: 'calories' | 'protein' | 'water',
    days: number
  ): number {
    if (!user) return 0;
    
    const history = this.getMetricHistory(user, metricType);
    
    if (history.length === 0) return 0;
    
    // Begrenze auf die letzten X Tage
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    const recentEntries = history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= today;
    });
    
    if (recentEntries.length === 0) return 0;
    
    // Berechne den Durchschnitt
    const sum = recentEntries.reduce((total, entry) => total + entry.value, 0);
    return sum / recentEntries.length;
  }
}

export default new TrackingService(); 