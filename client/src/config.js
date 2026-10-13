// ---------------------------------------------------------------------------
// Everything personal lives in this one file. Edit the text, dates and photos
// here; no need to touch any component.
// ---------------------------------------------------------------------------

import laugh from './assets/images/laugh.jpg'
import hat from './assets/images/hat.jpg'
import violet from './assets/images/violet.jpg'
import sepia from './assets/images/sepia.jpg'
import sideeye from './assets/images/sideeye.jpg'
import ember from './assets/images/ember.jpg'
import hearts from './assets/images/hearts.jpg'

export const CONFIG = {
  recipient: { full: 'Misba', nick: 'Misu' },
  from: { name: 'Kirti' },

  // Her birthday as 'YYYY-MM-DD' (example: '2007-03-14').
  // Leave it empty and the age, the "days lived" counter and the candle count
  // quietly switch to age-free versions, so nothing shows a wrong number.
  birthDate: '2008-10-13',

  // Optional background music file placed in /public (example: '/music/bgm.mp3').
  // Leave empty to use the built-in synthesised "Happy Birthday" melody.
  music: '',

  // Optional "reply" button on the last page, e.g. a WhatsApp link so Misu can
  // message Kritika straight back:
  // 'https://wa.me/91XXXXXXXXXX?text=Thank%20you%20for%20the%20surprise%21'
  replyUrl: '',

  // Optional videos. Put the files in /public/videos and list them here:
  // { src: '/videos/clip1.mp4', poster: '/videos/clip1.jpg', title: 'Remember this?' }
  videos: [],

  // `focus` is the point the square memory-card crop stays centred on.
  photos: [
    {
      id: 'laugh',
      src: laugh,
      title: 'The Laugh',
      vibe: 'Pure joy',
      note: 'The kind of laugh that makes everyone around you start laughing too.',
      alt: 'Misu laughing with a finger on her lip',
      focus: '50% 40%',
    },
    {
      id: 'hat',
      src: hat,
      title: 'Soft Smile Era',
      vibe: 'Quiet charm',
      note: 'A small smile that somehow says a whole lot.',
      alt: 'Misu smiling softly, head tilted',
      focus: '45% 40%',
    },
    {
      id: 'violet',
      src: violet,
      title: 'Neon Mood',
      vibe: 'Main character',
      note: 'Main-character lighting, zero effort required.',
      alt: 'Misu in purple light with her hand near her lips',
      focus: '55% 40%',
    },
    {
      id: 'sepia',
      src: sepia,
      title: 'Old Film',
      vibe: 'Timeless',
      note: 'Black and white, and still the most colourful person around.',
      alt: 'Black and white portrait of Misu',
      focus: '50% 45%',
    },
    {
      id: 'sideeye',
      src: sideeye,
      title: 'The Look',
      vibe: 'No words needed',
      note: 'That side glance says everything. We understood. We are a little scared.',
      alt: 'Misu giving a side glance',
      focus: '50% 40%',
    },
    {
      id: 'ember',
      src: ember,
      title: 'Golden Hour Thoughts',
      vibe: 'Dreamy',
      note: 'Whatever you were thinking here, we hope it was about cake.',
      alt: 'Misu looking thoughtful in warm light',
      focus: '55% 40%',
    },
    {
      id: 'hearts',
      src: hearts,
      title: 'Heart Filter Approved',
      vibe: 'Sweet',
      note: 'Even the filter knows you deserve all the hearts.',
      alt: 'Misu with floating heart stickers',
      focus: '50% 45%',
    },
  ],

  intro: [
    {
      kicker: 'A tiny announcement',
      title: 'Somewhere out there, a very special day is here.',
      body: 'And someone went to a lot of trouble to make sure you noticed.',
    },
    {
      kicker: 'Official record',
      title: 'Name: Misba. Known as: Misu.',
      body: 'Certified favourite person. Professional smile-giver. Birthday status: active.',
    },
    {
      kicker: 'Heads up',
      title: 'Warning: a lot of sweetness ahead.',
      body: 'Three little games, one wish, and a letter. Sound on for the full experience.',
    },
  ],

  // The scratch card hides this, then the letter unfolds.
  letter: {
    greeting: 'Dear Misu,',
    paragraphs: [
      'Happy Birthday! Another year, and another reason for me to tell you how glad I am to have you around. A normal text felt far too small for today, so I asked for this whole little corner of the internet to be made for you.',
      'Thank you for the laughs, the random conversations, and for being the kind of person who makes ordinary days feel lighter. I hope this year brings you quiet mornings, loud celebrations, and every good thing you have been secretly wishing for.',
      'Eat the cake, ignore the stress, take far too many photos, and remember that you are loved more than you probably realise. Now go enjoy your day. You have earned every bit of it.',
    ],
    signoff: 'Always yours,',
    signature: 'Kirti',
  },

  // Playful "fortune" quiz. Every answer is a good answer: each option adds
  // a point to one personality, and the top one becomes her fortune.
  quiz: {
    questions: [
      {
        q: 'Pick the perfect birthday morning.',
        options: [
          { text: 'Slow, cosy, favourite drink in hand', trait: 'cozy' },
          { text: 'Get ready and make a dramatic entrance', trait: 'sparkle' },
          { text: 'A surprise plan nobody told me about', trait: 'bold' },
          { text: 'Stay in bed and daydream for an hour', trait: 'dreamy' },
        ],
      },
      {
        q: 'Which soundtrack fits your year?',
        options: [
          { text: 'Lo-fi beats on a rainy evening', trait: 'cozy' },
          { text: 'Dance-floor anthems, volume up', trait: 'sparkle' },
          { text: 'Something loud, confident and fearless', trait: 'bold' },
          { text: 'Soft acoustic, golden hour', trait: 'dreamy' },
        ],
      },
      {
        q: 'Choose a treasure.',
        options: [
          { text: 'A well-worn diary', trait: 'cozy' },
          { text: 'A camera that loves you back', trait: 'sparkle' },
          { text: 'A map with one spot circled', trait: 'bold' },
          { text: 'A jar full of tiny stars', trait: 'dreamy' },
        ],
      },
      {
        q: 'What colour is your wish?',
        options: [
          { text: 'Warm amber', trait: 'cozy' },
          { text: 'Glittering pink', trait: 'sparkle' },
          { text: 'Electric red', trait: 'bold' },
          { text: 'Deep midnight purple', trait: 'dreamy' },
        ],
      },
    ],
    fortunes: {
      cozy: {
        title: 'The Cosy Star',
        text: 'Your year looks warm: good people, good food, and a kind of peace that finds you without being asked.',
      },
      sparkle: {
        title: 'The Sparkle Maker',
        text: 'Brace yourself. This year you light up every room you walk into, and everybody notices.',
      },
      bold: {
        title: 'The Fearless One',
        text: 'A big, brave decision is on its way, and you are going to handle it exactly the way you always do.',
      },
      dreamy: {
        title: 'The Dreamer',
        text: 'A wish you almost gave up on gets closer this year. Keep it safe. It is nearer than you think.',
      },
    },
    reading: 'Fortune read and signed by Kritika',
  },
}

// ---------------------------------------------------------------------------
// Derived values. No need to edit below this line.
// ---------------------------------------------------------------------------

const parsedBirth = CONFIG.birthDate ? new Date(`${CONFIG.birthDate}T00:00:00`) : null
export const BIRTH = parsedBirth && !Number.isNaN(parsedBirth.getTime()) ? parsedBirth : null

/** Age she turns in the current calendar year, or null if no birth date is set. */
export const TURNING_AGE = BIRTH ? new Date().getFullYear() - BIRTH.getFullYear() : null

/** Candle count: her age (capped for layout), or a friendly default. */
export const CANDLE_COUNT = TURNING_AGE && TURNING_AGE > 0 ? Math.min(TURNING_AGE, 24) : 10
