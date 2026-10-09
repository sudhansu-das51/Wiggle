/**
 * Programs offered at Wiggle.
 * Exactly 4 programs: Playgroup, Nursery, Jr. KG, Sr. KG.
 */
export const programs = [
  {
    slug: 'playgroup',
    name: 'Playgroup',
    ageRange: '1.5 to 2.5 yrs',
    minAge: 1.5,
    maxAge: 2.5,
    groupSize: 'Up to 10 children',
    daysPerWeek: '5 days',
    meals: 'Snack only',
    focus: 'Settling in, sensory play, first words',
    tint: 'yellow',
    image: '/images/playgroup.png',
    tagline: 'First steps into gentle, joy-filled discovery',
    summary: 'A warm, sensorial introduction to school where toddlers build confidence, explore textures, and learn to giggle with peers.',
    highlights: [
      'Sensory play tubs with sand, water, and clay',
      'Gentle transition with parent-assisted initial days',
      'Music, nursery rhythms, and big motor movement',
    ],
    timings: '9:00 am to 11:30 am',
    learningAreaIds: ['socio-emotional', 'creative-arts', 'motor-agility'],
    dailyRoutine: [
      { time: '9:00 am', title: 'Welcome and free play', text: 'Gentle greetings and soft toy exploration.' },
      { time: '9:45 am', title: 'Sensory circle', text: 'Singing, finger rhymes, and tactile bins.' },
      { time: '10:30 am', title: 'Fruit break', text: 'Self-feeding practice with peer companionship.' },
      { time: '11:00 am', title: 'Goodbye rhythm', text: 'Wind-down music and parent pickup.' },
    ],
    icon: 'smile',
    whatToBring: [
      "Water bottle labeled with child's name",
      'Two complete spare sets of clothes',
      'A small favorite comfort toy or blanket',
      'Slip-on soft shoes for indoor exploration',
      'Diaper pack and gentle wipes if needed',
    ],
    faqs: [
      {
        question: 'How does the settling-in week work for Playgroup?',
        answer: 'We take separation gently. A parent or caregiver stays in the room or our cozy lounge during the first few mornings. As your toddler builds trust with their key educator, time away is stretched gradually.',
      },
      {
        question: 'What if my toddler is not toilet trained yet?',
        answer: 'No problem at all! We do not require toddlers in Playgroup to be toilet trained. Our team partners with families to encourage bathroom readiness only when the child is happy and ready.',
      },
      {
        question: 'What does my child eat during the morning fruit break?',
        answer: 'We offer seasonal cut fruits, steamed sweet potato, and warm organic millet porridge. Parents can also pack familiar finger foods if their toddler has specific comfort preferences.',
      },
    ],
  },
  {
    slug: 'nursery',
    name: 'Nursery',
    ageRange: '2.5 to 3.5 yrs',
    minAge: 2.5,
    maxAge: 3.5,
    groupSize: 'Up to 12 children',
    daysPerWeek: '5 days',
    meals: 'Snack and warm lunch',
    focus: 'Curiosity, first friendships, messy art',
    tint: 'pink',
    image: '/images/nurseryy.png',
    tagline: 'Curiosity blooms through questions and paint',
    summary: 'Children expand their vocabulary, test everyday physics with wooden blocks, and form their very first deep friendships.',
    highlights: [
      'Story circles that spark imagination and early vocabulary',
      'Daily messy-art studio sessions and mud kitchen play',
      'Foundational self-help habits and collaborative cleanup',
    ],
    timings: '8:45 am to 12:15 pm',
    learningAreaIds: ['language-literacy', 'creative-arts', 'motor-agility'],
    dailyRoutine: [
      { time: '8:45 am', title: 'Arrival & tabletop discovery', text: 'Puzzles, loose parts, and color sorting.' },
      { time: '9:30 am', title: 'Morning circle', text: 'Sharing thoughts, weather chart, and puppet tales.' },
      { time: '10:30 am', title: 'Outdoor garden time', text: 'Sandpit building, tricycles, and bubble chasing.' },
      { time: '11:30 am', title: 'Snack & reflection', text: 'Mindful eating and conversation.' },
    ],
    icon: 'palette',
    whatToBring: [
      "Water bottle with child's name",
      'Two spare sets of cotton clothes',
      'Messy-play apron or oversized old shirt',
      'Velcro sandals easy for little hands to put on',
      'A wide-brim sun hat for garden sandpit time',
    ],
    faqs: [
      {
        question: 'How is toilet training supported in Nursery?',
        answer: 'Our educators guide toddlers to the restroom at predictable rhythms and celebrate every independent attempt. Accidents are met with calm reassurance and fresh clothes with zero stress.',
      },
      {
        question: "How do teachers help children who don't want to share?",
        answer: "At 2.5 to 3.5 years, sharing is developmentally new! We focus on 'taking turns' with sand timers, providing duplicate popular toys, and modeling kind words rather than forcing sharing.",
      },
      {
        question: 'What art materials do Nursery children use?',
        answer: 'We use non-toxic edible-safe tempera paints, natural beeswax crayons, wet clay, and water bins. Children are encouraged to explore with their fingers and brushes freely.',
      },
    ],
  },
  {
    slug: 'jr-kg',
    name: 'Jr. KG',
    ageRange: '3.5 to 4.5 yrs',
    minAge: 3.5,
    maxAge: 4.5,
    groupSize: 'Up to 14 children',
    daysPerWeek: '5 days',
    meals: 'Snack and warm lunch',
    focus: 'Phonics discovery, number games, science',
    tint: 'mint',
    image: '/images/jrkgg.png',
    tagline: 'Phonics, numbers, and hands-on science',
    summary: 'Building early numeracy and phonemic awareness through playful investigation, balance beams, and collaborative group games.',
    highlights: [
      'Multi-sensory phonics with sound tubs and tactile letters',
      'Concrete math concepts using natural counters and scales',
      'Science exploration tables with magnifying glasses and seeds',
    ],
    timings: '8:30 am to 12:45 pm',
    learningAreaIds: ['language-literacy', 'numeracy-logic', 'discovery-science'],
    dailyRoutine: [
      { time: '8:30 am', title: 'Inquiry centers', text: 'Phonics corners, block engineering, and biology table.' },
      { time: '9:45 am', title: 'Math discovery', text: 'Counting stones, pattern making, and balance scales.' },
      { time: '11:00 am', title: 'Playground agility', text: 'Obstacle courses, relay games, and tree climbing.' },
      { time: '12:00 pm', title: 'Journal sketch', text: 'Drawing their favorite discovery of the day.' },
    ],
    icon: 'rocket',
    whatToBring: [
      "Water bottle labeled with child's name",
      'One spare set of clothes in a zip pouch',
      'Comfortable sneakers for balance beam agility',
      'Sun hat for outdoor garden and science runs',
      'Pocket handkerchief or small hand towel',
    ],
    faqs: [
      {
        question: 'How do you introduce letters and numbers in Jr. KG?',
        answer: 'We avoid dry worksheets! Phonics is introduced through sensory sound bins, tactile sandpaper letters, and rhythmic rhyming stories. Math is explored with pinecones, scales, and pattern blocks.',
      },
      {
        question: 'Do children get homework in Jr. KG?',
        answer: 'Never traditional homework. Instead, we suggest joyful home invitations: hunting for circles in your kitchen, listening for bird sounds in the park, or sharing a bedtime picture book.',
      },
      {
        question: 'How much outdoor time is scheduled every day?',
        answer: 'At least 45 to 60 minutes daily in our garden, sandpit, and tree canopy zones, weather permitting. Active movement directly supports focus and emotional regulation.',
      },
    ],
  },
  {
    slug: 'sr-kg',
    name: 'Sr. KG',
    ageRange: '4.5 to 5.5 yrs',
    minAge: 4.5,
    maxAge: 5.5,
    groupSize: 'Up to 16 children',
    daysPerWeek: '5 days',
    meals: 'Snack and warm lunch',
    focus: 'Reading fluency, team STEM, primary readiness',
    tint: 'sky',
    image: '/images/srkgg.png',
    tagline: 'Independent thinkers ready for primary school',
    summary: 'Confident young learners mastering early reading, expressive storytelling, team problem solving, and joyful school readiness.',
    highlights: [
      'Creative journaling and emergent book reading',
      'Stem challenges: bridge construction, shadow experiments',
      'Confidence building: show-and-tell and group theatricals',
    ],
    timings: '8:30 am to 1:15 pm',
    learningAreaIds: ['language-literacy', 'numeracy-logic', 'discovery-science', 'socio-emotional'],
    dailyRoutine: [
      { time: '8:30 am', title: 'Morning news & reading', text: 'Independent book corners and daily news board.' },
      { time: '10:00 am', title: 'Project workshop', text: 'Hands-on team investigations and building tasks.' },
      { time: '11:30 am', title: 'Lunch & community chores', text: 'Setting mats, sharing food, and clearing tables.' },
      { time: '12:45 pm', title: 'Closing circle & theatricals', text: 'Drama, role-play, and learning debrief.' },
    ],
    icon: 'book',
    whatToBring: [
      "Water bottle with child's name",
      'One spare outfit in a cloth drawstring bag',
      'Outdoor running shoes with secure velcro',
      'Personal sketchbook for nature observations',
      'Small fruit or healthy snack box for morning recess',
    ],
    faqs: [
      {
        question: 'How does Wiggle prepare children for primary school admissions?',
        answer: 'Our emergent readers develop expressive vocabulary, independent pencil grip, collaborative problem solving, and confidence during interaction rounds without feeling pressured.',
      },
      {
        question: 'Can Sr. KG children read full sentences by the end of the year?',
        answer: 'Most children naturally read phonetically decodable storybooks and write their own short thoughts in daily journals by springtime, guided by their individual curiosity.',
      },
      {
        question: 'How do teachers foster teamwork and leadership?',
        answer: 'Children work in small groups on multi-day STEM builds, take turns leading morning news circles, and care for our shared learning spaces together.',
      },
    ],
  },
];

/**
 * 4 clear admission steps styled like ticket stubs.
 */
export const admissionSteps = [
  {
    title: 'Say hello',
    text: 'Reach out on WhatsApp or fill in our enquiry form to tell us about your little one and your family rhythms.',
    icon: 'whatsapp',
  },
  {
    title: 'Visit the school',
    text: 'Walk through our sunlight-filled studios, garden sandpit, tactile water table, and block labs.',
    icon: 'home',
  },
  {
    title: 'Meet the teachers',
    text: 'Sit on the floor together, observe how your child explores the room, and ask every question on your mind.',
    icon: 'users',
  },
  {
    title: 'Confirm your seat',
    text: 'Complete simple enrolment details, receive your child’s welcome sticker kit, and plan your settling-in week.',
    icon: 'check',
  },
];
