import { Coach } from '../types/coach';

export const coaches: Coach[] = [
  {
    id: 'coach1',
    name: 'Dr. Lisa Müller',
    bio: {
      en: 'Nutritionist with 10+ years of experience specializing in weight management and healthy eating habits.',
      de: 'Ernährungswissenschaftlerin mit über 10 Jahren Erfahrung, spezialisiert auf Gewichtsmanagement und gesunde Essgewohnheiten.',
      sq: 'Nutricioniste me mbi 10 vjet përvojë, e specializuar në menaxhimin e peshës dhe zakonet e shëndetshme të të ngrënit.'
    },
    specialty: {
      en: 'Weight Management',
      de: 'Gewichtsmanagement',
      sq: 'Menaxhimi i peshës'
    },
    image: '/assets/coaches/coach1.jpg',
    greetings: {
      en: [
        'Hello! I\'m Dr. Lisa Müller. I\'m here to help you reach your nutrition goals!',
        'Welcome back! Ready to make some healthy choices today?',
        'Hi there! Let\'s work together on your nutrition journey!'
      ],
      de: [
        'Hallo! Ich bin Dr. Lisa Müller. Ich bin hier, um dir bei deinen Ernährungszielen zu helfen!',
        'Willkommen zurück! Bereit, heute einige gesunde Entscheidungen zu treffen?',
        'Hallo! Lass uns gemeinsam an deiner Ernährungsreise arbeiten!'
      ],
      sq: [
        'Përshëndetje! Unë jam Dr. Lisa Müller. Jam këtu për t\'ju ndihmuar të arrini qëllimet tuaja të ushqyerjes!',
        'Mirësevini përsëri! Gati për të bërë disa zgjedhje të shëndetshme sot?',
        'Përshëndetje! Le të punojmë së bashku në udhëtimin tuaj të ushqyerjes!'
      ]
    },
    motivationalPhrases: {
      en: [
        'Every healthy meal is a step toward your goals!',
        'Progress over perfection - you\'re doing great!',
        'Small changes lead to big results over time!'
      ],
      de: [
        'Jede gesunde Mahlzeit ist ein Schritt in Richtung deiner Ziele!',
        'Fortschritt statt Perfektion - du machst das großartig!',
        'Kleine Änderungen führen mit der Zeit zu großen Ergebnissen!'
      ],
      sq: [
        'Çdo vakt i shëndetshëm është një hap drejt qëllimeve tuaja!',
        'Përparimi mbi perfeksionin - po bëni shumë mirë!',
        'Ndryshimet e vogla çojnë në rezultate të mëdha me kalimin e kohës!'
      ]
    },
    tips: {
      en: [
        'Try to include protein in every meal to stay fuller longer.',
        'Drinking water before meals can help prevent overeating.',
        'Preparing meals ahead of time can help you make healthier choices throughout the week.',
        'Eat slowly and mindfully to better recognize your body\'s fullness signals.',
        'Include colorful vegetables in your meals for more nutrients.'
      ],
      de: [
        'Versuche, bei jeder Mahlzeit Protein einzubauen, um länger satt zu bleiben.',
        'Vor den Mahlzeiten Wasser zu trinken kann helfen, übermäßiges Essen zu vermeiden.',
        'Die Vorbereitung von Mahlzeiten im Voraus kann dir helfen, die ganze Woche über gesündere Entscheidungen zu treffen.',
        'Iss langsam und bewusst, um die Sättigungssignale deines Körpers besser zu erkennen.',
        'Füge deinen Mahlzeiten bunte Gemüsesorten hinzu, um mehr Nährstoffe zu erhalten.'
      ],
      sq: [
        'Përpiquni të përfshini proteina në çdo vakt për të qëndruar më të ngopur për më gjatë.',
        'Pirja e ujit para vakteve mund të ndihmojë në parandalimin e mbingrënies.',
        'Përgatitja e vakteve paraprakisht mund t\'ju ndihmojë të bëni zgjedhje më të shëndetshme gjatë gjithë javës.',
        'Hani ngadalë dhe me vëmendje për të njohur më mirë sinjalet e ngopjes së trupit tuaj.',
        'Përfshini perime me ngjyra në vaktet tuaja për më shumë lëndë ushqyese.'
      ]
    }
  },
  {
    id: 'coach2',
    name: 'Marco Rossi',
    bio: {
      en: 'Fitness trainer and nutrition coach specializing in performance nutrition and meal planning for active individuals.',
      de: 'Fitnesstrainer und Ernährungscoach, spezialisiert auf Leistungsernährung und Mahlzeitenplanung für aktive Menschen.',
      sq: 'Trajner fitnesi dhe këshilltar ushqimor i specializuar në ushqimin e performancës dhe planifikimin e vakteve për individët aktivë.'
    },
    specialty: {
      en: 'Sports Nutrition',
      de: 'Sporternährung',
      sq: 'Ushqyerja sportive'
    },
    image: '/assets/coaches/coach2.jpg',
    greetings: {
      en: [
        'Hey, I\'m Marco! Ready to fuel your body for optimal performance?',
        'Welcome back! Let\'s keep building healthy habits together!',
        'Hello! I\'m here to help you reach both your fitness and nutrition goals!'
      ],
      de: [
        'Hey, ich bin Marco! Bereit, deinen Körper für optimale Leistung zu versorgen?',
        'Willkommen zurück! Lass uns gemeinsam weiter gesunde Gewohnheiten aufbauen!',
        'Hallo! Ich bin hier, um dir zu helfen, sowohl deine Fitness- als auch deine Ernährungsziele zu erreichen!'
      ],
      sq: [
        'Hej, unë jam Marco! Gati për të furnizuar trupin tuaj për performancë optimale?',
        'Mirësevini përsëri! Le të vazhdojmë të ndërtojmë zakone të shëndetshme së bashku!',
        'Përshëndetje! Jam këtu për t\'ju ndihmuar të arrini si qëllimet e fitnesit ashtu edhe ato të ushqyerjes!'
      ]
    },
    motivationalPhrases: {
      en: [
        'Your body is a machine - give it the right fuel!',
        'Strength comes from recovery and proper nutrition!',
        'Every workout deserves the right nutrition to maximize results!'
      ],
      de: [
        'Dein Körper ist eine Maschine - gib ihm den richtigen Treibstoff!',
        'Stärke kommt von Erholung und richtiger Ernährung!',
        'Jedes Training verdient die richtige Ernährung, um die Ergebnisse zu maximieren!'
      ],
      sq: [
        'Trupi juaj është një makinë - jepini karburantin e duhur!',
        'Forca vjen nga rikuperimi dhe ushqyerja e duhur!',
        'Çdo stërvitje meriton ushqimin e duhur për të maksimizuar rezultatet!'
      ]
    },
    tips: {
      en: [
        'Consume protein within 30 minutes after your workout for optimal recovery.',
        'Don\'t forget to hydrate before, during, and after exercise.',
        'Carbohydrates are your body\'s preferred fuel source for high-intensity workouts.',
        'For muscle gain, aim for 1.6-2.2g of protein per kg of body weight daily.',
        'Healthy fats are essential for hormone production, including testosterone which helps with muscle growth.'
      ],
      de: [
        'Nimm innerhalb von 30 Minuten nach deinem Training Protein zu dir, um eine optimale Erholung zu gewährleisten.',
        'Vergiss nicht, vor, während und nach dem Sport zu hydratisieren.',
        'Kohlenhydrate sind die bevorzugte Energiequelle deines Körpers für hochintensives Training.',
        'Für Muskelaufbau solltest du täglich 1,6-2,2 g Protein pro kg Körpergewicht anstreben.',
        'Gesunde Fette sind wichtig für die Hormonproduktion, einschließlich Testosteron, das beim Muskelwachstum hilft.'
      ],
      sq: [
        'Konsumoni proteina brenda 30 minutave pas stërvitjes për rikuperim optimal.',
        'Mos harroni të hidratoheni para, gjatë dhe pas ushtrimeve.',
        'Karbohidratet janë burimi i preferuar i karburantit të trupit tuaj për stërvitje me intensitet të lartë.',
        'Për rritje të muskujve, synoni 1.6-2.2g proteina për kg të peshës trupore çdo ditë.',
        'Yndyrat e shëndetshme janë thelbësore për prodhimin e hormoneve, duke përfshirë testosteronin që ndihmon në rritjen e muskujve.'
      ]
    }
  },
  {
    id: 'coach3',
    name: 'Fatima Ahmed',
    bio: {
      en: 'Certified dietitian specializing in plant-based nutrition and sustainable eating patterns.',
      de: 'Zertifizierte Ernährungsberaterin, spezialisiert auf pflanzenbasierte Ernährung und nachhaltige Ernährungsmuster.',
      sq: 'Dietologe e certifikuar e specializuar në ushqimin me bazë bimore dhe modelet e qëndrueshme të të ngrënit.'
    },
    specialty: {
      en: 'Plant-Based Nutrition',
      de: 'Pflanzenbasierte Ernährung',
      sq: 'Ushqim me bazë bimore'
    },
    image: '/assets/coaches/coach3.jpg',
    greetings: {
      en: [
        'Hello! I\'m Fatima, your guide to delicious and nutritious plant-based eating!',
        'Welcome back! Ready to explore more plant-powered options today?',
        'Hi there! Let\'s make your nutrition journey sustainable and enjoyable!'
      ],
      de: [
        'Hallo! Ich bin Fatima, deine Begleiterin für leckeres und nahrhaftes pflanzliches Essen!',
        'Willkommen zurück! Bereit, heute mehr pflanzenbasierte Optionen zu erkunden?',
        'Hallo! Lass uns deine Ernährungsreise nachhaltig und angenehm gestalten!'
      ],
      sq: [
        'Përshëndetje! Unë jam Fatima, udhërrëfyesi juaj për të ngrënë me bimë të shijshme dhe ushqyese!',
        'Mirësevini përsëri! Gati për të eksploruar më shumë opsione me bazë bimore sot?',
        'Përshëndetje! Le ta bëjmë udhëtimin tuaj ushqyes të qëndrueshëm dhe të këndshëm!'
      ]
    },
    motivationalPhrases: {
      en: [
        'Plants have all the nutrients you need to thrive!',
        'Every plant-based meal is a gift to your body and the planet!',
        'Small sustainable changes create long-lasting health benefits!'
      ],
      de: [
        'Pflanzen enthalten alle Nährstoffe, die du brauchst, um zu gedeihen!',
        'Jede pflanzliche Mahlzeit ist ein Geschenk an deinen Körper und den Planeten!',
        'Kleine nachhaltige Änderungen schaffen langanhaltende gesundheitliche Vorteile!'
      ],
      sq: [
        'Bimët kanë të gjitha lëndët ushqyese që ju nevojiten për të lulëzuar!',
        'Çdo vakt me bazë bimore është një dhuratë për trupin tuaj dhe planetin!',
        'Ndryshimet e vogla të qëndrueshme krijojnë përfitime afatgjata shëndetësore!'
      ]
    },
    tips: {
      en: [
        'Include a variety of colorful vegetables to ensure you get a wide range of nutrients.',
        'Legumes, tofu, and tempeh are excellent sources of plant-based protein.',
        'Seeds and nuts are not just for snacking - they add protein and healthy fats to meals and smoothies.',
        'Plant-based eating doesn\'t have to be all-or-nothing. Start with one plant-based day per week.',
        'Fortified plant milks can help ensure you get enough calcium and vitamin B12.'
      ],
      de: [
        'Integriere eine Vielzahl bunter Gemüsesorten, um eine breite Palette an Nährstoffen zu erhalten.',
        'Hülsenfrüchte, Tofu und Tempeh sind ausgezeichnete Quellen für pflanzliches Protein.',
        'Samen und Nüsse sind nicht nur zum Snacken da - sie fügen Mahlzeiten und Smoothies Protein und gesunde Fette hinzu.',
        'Pflanzliche Ernährung muss nicht alles oder nichts sein. Beginne mit einem pflanzlichen Tag pro Woche.',
        'Angereicherte Pflanzenmilch kann dir helfen, genügend Kalzium und Vitamin B12 zu bekommen.'
      ],
      sq: [
        'Përfshini një larmi perimesh me ngjyra për të siguruar që merrni një gamë të gjerë lëndësh ushqyese.',
        'Bishtajoret, tofu dhe tempeh janë burime të shkëlqyera të proteinave me bazë bimore.',
        'Farat dhe arrat nuk janë vetëm për zamkë - ato shtojnë proteina dhe yndyrna të shëndetshme në vakte dhe smoothie.',
        'Të ngrënit me bazë bimore nuk duhet të jetë të gjitha ose asgjë. Filloni me një ditë me bazë bimore në javë.',
        'Qumështi i fortifikuar i bimëve mund të ndihmojë të siguroni që merrni kalcium dhe vitaminë B12 të mjaftueshme.'
      ]
    }
  }
]; 