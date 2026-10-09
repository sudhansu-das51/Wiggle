/**
 * Curriculum framework at Wiggle.
 * 6 learning areas and 4 seasonal term plans.
 */
export const curriculum = {
  learningAreas: [
    {
      id: 'socio-emotional',
      name: 'Emotional wellbeing & kindness',
      icon: 'heart',
      tint: 'pink',
      description: 'Understanding feelings, naming emotions, sharing spaces, resolving small conflicts, and practicing daily kindness.',
      skills: ['Identifying emotions with feeling cards', 'Taking turns and asking for help', 'Empathy for living creatures'],
    },
    {
      id: 'language-literacy',
      name: 'Emergent literacy & storytelling',
      icon: 'book',
      tint: 'yellow',
      description: 'Listening to rich tales, phonics awareness through rhythm, puppet conversation, and expressive self-narration.',
      skills: ['Phonemic sound matching', 'Narrative comprehension and retelling', 'Fine-motor pre-writing pencil grip'],
    },
    {
      id: 'numeracy-logic',
      name: 'Playful math & spatial logic',
      icon: 'blocks',
      tint: 'mint',
      description: 'Counting pinecones, sorting by texture and weight, recognizing repeating patterns, and geometry through blocks.',
      skills: ['1-to-1 correspondence with loose parts', 'Comparative sizing: heavier, lighter, longer', 'Spatial patterns and tessellations'],
    },
    {
      id: 'discovery-science',
      name: 'Scientific inquiry & nature study',
      icon: 'leaf',
      tint: 'sky',
      description: 'Investigating light and shadows, watching seed sprouts, water currents, weather observation, and tactile biology.',
      skills: ['Hypothesizing with simple sensory tests', 'Magnifying glass inspection', 'Plant care and composting'],
    },
    {
      id: 'creative-arts',
      name: 'Expressive art, clay & music',
      icon: 'palette',
      tint: 'yellow',
      description: 'Process-oriented painting, clay modeling, percussion rhythms, dramatic theatre, and spontaneous singing.',
      skills: ['Color mixing and texture layering', 'Rhythmic percussion beat keeping', 'Imaginative costume role-play'],
    },
    {
      id: 'motor-agility',
      name: 'Gross & fine motor agility',
      icon: 'ball',
      tint: 'mint',
      description: 'Balance walking beams, climbing rope ladders, obstacle navigation, threading beads, and using safety scissors.',
      skills: ['Core balance and bilateral coordination', 'Hand-eye agility in catching and rolling', 'Pincer precision with clay tools'],
    },
  ],
  yearPlan: [
    {
      term: 'Term 1 (July – Sept)',
      theme: 'Me, my family & our colorful world',
      focus: 'Settling with confidence, self-portraits, sensory textures, color discovery, and establishing predictable daily rhythms.',
    },
    {
      term: 'Term 2 (Oct – Dec)',
      theme: 'Creepy crawlies, trees & lanterns',
      focus: 'Backyard ecology, caterpillar life cycles, autumn leaves, harvest celebrations, and community helpers.',
    },
    {
      term: 'Term 3 (Jan – Feb)',
      theme: 'Water, wind & wonderful wheels',
      focus: 'Floating experiments, wind ribbons, wheels on buses, transport mechanics, and simple balance scales.',
    },
    {
      term: 'Term 4 (Mar – May)',
      theme: 'Stars, space & growing together',
      focus: 'Night sky constellations, celebration of growth, transition readiness, theatrical shows, and farewell memories.',
    },
  ],
  approach: [
    {
      title: 'Play',
      measure: 'a big handful, every day',
      text: 'Unstructured tinkering, mud kitchens, and block towers where trial and error teach more than any lecture.',
      icon: 'ball',
    },
    {
      title: 'Routine',
      measure: 'one steady spoonful',
      text: 'Calm visual schedules, morning circles, and unhurried transitions that help little nervous systems feel secure.',
      icon: 'clock',
    },
    {
      title: 'Curiosity',
      measure: 'as much as they can carry',
      text: 'Questions sparked by falling leaves, bugs under stones, and magnifying glasses that follow children’s natural wonder.',
      icon: 'star',
    },
    {
      title: 'Kindness',
      measure: 'to taste, then a little more',
      text: 'Turn-taking timers, gentle conflict coaching, and feeling check-ins that build deep emotional empathy.',
      icon: 'heart',
    },
  ],
  method: [
    {
      title: 'Wonder',
      text: 'We set out invitation trays with natural loose parts, light tables, or wet clay, sparking questions before offering answers.',
    },
    {
      title: 'Try',
      text: 'Children test ideas with their own hands—building, splashing, mixing, and discovering balance and color firsthand.',
    },
    {
      title: 'Share',
      text: 'We gather in gentle circles to recount what happened, admire each other’s creations, and celebrate joyful mistakes.',
    },
  ],
  sampleWeek: [
    {
      day: 'Monday',
      theme: 'Move and groove',
      activities: [
        'Obstacle courses and balance beams',
        'Rhythm sticks and freeze-dance games',
        'Animal walks across the lawn',
      ],
    },
    {
      day: 'Tuesday',
      theme: 'Messy-paint day',
      activities: [
        'Big butcher paper easel murals',
        'Finger paints with tactile spice aromas',
        'Color mixing in oversized water tubs',
      ],
    },
    {
      day: 'Wednesday',
      theme: 'Story and song',
      activities: [
        'Felt-board puppetry and folk tales',
        'Singing echo songs with acoustic ukulele',
        'Costume dress-up and dramatic play',
      ],
    },
    {
      day: 'Thursday',
      theme: 'Little scientists',
      activities: [
        'Magnifying glass garden safari',
        'Sink or float water tub experiments',
        'Seed planting and soil texture checks',
      ],
    },
    {
      day: 'Friday',
      theme: 'Show and tell',
      activities: [
        'Sharing a treasure from home with friends',
        'Collaborative wooden block city building',
        'Weekly kindness stars and cheerful wrap-up',
      ],
    },
  ],
  progress: [
    {
      title: 'A note every day',
      text: 'A cheerful daily handover note with what your child ate, slept, and a heartwarming moment from their morning.',
      sample: 'Today Aarav stacked seven blocks without any help and told everyone about it with a huge grin.',
    },
    {
      title: 'A photo journal every month',
      text: 'A curated visual collection capturing candid developmental milestones, messy studio creations, and friendship smiles.',
      sample: 'Ananya discovered that yellow and blue make green on our easel, spending twenty minutes testing every shade.',
    },
    {
      title: 'Parent and teacher meetings',
      text: 'Unhurried, conversational sit-downs twice a term to celebrate growth, share observations, and align on your child’s emotional happiness.',
      sample: 'We review your child’s learning portfolio together over tea—talking about social friendships, sensory preferences, and next milestones.',
    },
  ],
};
