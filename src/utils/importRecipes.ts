import { Recipe } from '../services/RecipeService';

// Funktion zum Importieren der neuen Rezepte
export const importNewRecipes = () => {
  // Neue Rezepte
  const newRecipes: Omit<Recipe, 'id'>[] = [
    // Hier werden die 50 neuen Rezepte eingefügt - diese sollten aus der JSON-Liste des Benutzers kommen
    // Die ID wird automatisch beim Hinzufügen generiert
  ];

  // Bestehende Rezepte aus dem localStorage laden
  const existingRecipesJSON = localStorage.getItem('nutricoach_user_recipes');
  const existingRecipes: Recipe[] = existingRecipesJSON ? JSON.parse(existingRecipesJSON) : [];
  
  // Eindeutige IDs für neue Rezepte generieren und zur Liste hinzufügen
  const recipesToAdd: Recipe[] = newRecipes.map(recipe => ({
    ...recipe,
    id: `user-recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }));
  
  // Kombinierte Liste speichern
  const updatedRecipes = [...existingRecipes, ...recipesToAdd];
  localStorage.setItem('nutricoach_user_recipes', JSON.stringify(updatedRecipes));
  
  console.log(`${recipesToAdd.length} neue Rezepte wurden hinzugefügt!`);
  return updatedRecipes;
};

// Funktion zum Überprüfen, wie viele Rezepte im localStorage sind
export const countRecipes = () => {
  const existingRecipesJSON = localStorage.getItem('nutricoach_user_recipes');
  const existingRecipes: Recipe[] = existingRecipesJSON ? JSON.parse(existingRecipesJSON) : [];
  return existingRecipes.length;
}; 