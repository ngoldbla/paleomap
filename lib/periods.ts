export interface GeologicalPeriod {
  name: string
  era: string
  ageStart: number // millions of years ago
  ageEnd: number
  description: string
}

export const GEOLOGICAL_PERIODS: GeologicalPeriod[] = [
  {
    name: 'Permian',
    era: 'Paleozoic',
    ageStart: 299,
    ageEnd: 252,
    description: 'The last period before the formation of Pangea was complete'
  },
  {
    name: 'Triassic',
    era: 'Mesozoic',
    ageStart: 252,
    ageEnd: 201,
    description: 'Pangea begins to break apart. The age of early dinosaurs.'
  },
  {
    name: 'Jurassic',
    era: 'Mesozoic',
    ageStart: 201,
    ageEnd: 145,
    description: 'Laurasia and Gondwana separate. The age of giant dinosaurs.'
  },
  {
    name: 'Cretaceous',
    era: 'Mesozoic',
    ageStart: 145,
    ageEnd: 66,
    description: 'Atlantic Ocean widens. The final age of dinosaurs.'
  },
  {
    name: 'Paleocene',
    era: 'Cenozoic',
    ageStart: 66,
    ageEnd: 56,
    description: 'After the dinosaur extinction. Mammals begin to diversify.'
  },
  {
    name: 'Eocene',
    era: 'Cenozoic',
    ageStart: 56,
    ageEnd: 34,
    description: 'Warm global climate. India collides with Asia.'
  },
  {
    name: 'Oligocene',
    era: 'Cenozoic',
    ageStart: 34,
    ageEnd: 23,
    description: 'Global cooling begins. Antarctica freezes over.'
  },
  {
    name: 'Miocene',
    era: 'Cenozoic',
    ageStart: 23,
    ageEnd: 5,
    description: 'Grasslands expand. Great apes evolve.'
  },
  {
    name: 'Pliocene',
    era: 'Cenozoic',
    ageStart: 5,
    ageEnd: 2.6,
    description: 'Early human ancestors appear.'
  },
  {
    name: 'Pleistocene',
    era: 'Cenozoic',
    ageStart: 2.6,
    ageEnd: 0.012,
    description: 'Ice ages. Modern humans evolve.'
  },
  {
    name: 'Holocene',
    era: 'Cenozoic',
    ageStart: 0.012,
    ageEnd: 0,
    description: 'Current epoch. Human civilization develops.'
  }
]

export const MAJOR_PERIODS = [
  'Permian',
  'Triassic',
  'Jurassic',
  'Cretaceous',
  'Paleocene',
  'Eocene',
  'Oligocene',
  'Miocene',
  'Pliocene',
  'Pleistocene',
  'Holocene'
]
