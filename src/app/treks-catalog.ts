// src/app/treks-catalog.ts
// Catalog of treks for TrekMate

export type Trek = {
  id: string;
  name: string;
  region: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  image: string;
  description: string;
  price: string;
};

export const treks: Trek[] = [
  {
    id: 'himalayan-ascent',
    name: 'Himalayan Ascent',
    region: 'Himalayas',
    difficulty: 'Moderate',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk6ByCSSSxo1CAyxMtkHNNQ5-udfS9umEnwjreSd_ZpjVtuHyTUXLrjLflfz9MEvA7R4oMgPK4hCoAnesilx-YMvFscST5c7iHjmNxRjoJOPjqj8YFY6vTVLLafgOt4bD_T1IVLhOq7PVXQk_WPFwEU4Yj6o6--a7ed0gFRvJPOfJ3Z-sSEURhcTsAHUNyyWfQC86XC-QHGhklm28JzUM0TQRxCj_GSkWlX2-yY6l0KYfNHgBLFRQgvFsagMJJt95_JCMRmmJPXE9',
    description: 'A breathtaking trek through the mighty Himalayas, perfect for those seeking adventure and stunning vistas.',
    price: '₹12,000',
  },
  {
    id: 'western-ghats-trail',
    name: 'Western Ghats Trail',
    region: 'Western Ghats',
    difficulty: 'Challenging',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxbz_f8z4l8AeavSpaDTbN0xZ9OBcqSrxe2JpWSo3Ilnpkr402d6kFxTT2A08HCsBnekWkh5is-vlgVmIwTc87bzCjs2RM8Je1U0IcWEUx8diRyH3Fs1JrTeYIgc8uYvQUKTSmTzPlEsozRFdRDVQ9F-zq3DpNwNh8LTQ-ZBOexfuaCDUO6vLeEIaPrWg0uhIMADehBZhxV3H5w1yu4IavYrmrNZe6IsHkSQlE8bdpsI7XTnd1V3hpMA0Arzi3bamnnMqZX_Tsk_eY',
    description: 'A challenging trail through the lush Western Ghats, known for its biodiversity and scenic beauty.',
    price: '₹9,500',
  },
  {
    id: 'eastern-peaks-expedition',
    name: 'Eastern Peaks Expedition',
    region: 'Eastern India',
    difficulty: 'Easy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNZhH34KFnMZQ7wugn8aWB2FqNv8nXIuGu1Biihi6Atc8kfn6IXU-FIM3kFo4NPs4gPZZ_5U6mNWfNS9v5oPmuig-pjAJLVtFaIgKcrpoYoHwxgkVz2faJ1c2Xg5rMlqOMTxrrZF7oCYMGJfrwpzCCutF1mTCTMRnFMQQ4BpxoqWKcfJS59GVx690HTeOHtBiZDd59fffFhRIQuQcqhRUlzBnbdCaZLzFtQD01-2HslTnqnu8u9I9sTKACI3od3WpHgYqPc32Ttnt',
    description: 'An easy and enjoyable trek across the beautiful peaks of Eastern India, suitable for beginners and families.',
    price: '₹7,000',
  },
  {
    id: 'ladakh-high-altitude',
    name: 'Ladakh High Altitude Trek',
    region: 'Ladakh',
    difficulty: 'Challenging',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxbz_f8z4l8AeavSpaDTbN0xZ9OBcqSrxe2JpWSo3Ilnpkr402d6kFxTT2A08HCsBnekWkh5is-vlgVmIwTc87bzCjs2RM8Je1U0IcWEUx8diRyH3Fs1JrTeYIgc8uYvQUKTSmTzPlEsozRFdRDVQ9F-zq3DpNwNh8LTQ-ZBOexfuaCDUO6vLeEIaPrWg0uhIMADehBZhxV3H5w1yu4IavYrmrNZe6IsHkSQlE8bdpsI7XTnd1V3hpMA0Arzi3bamnnMqZX_Tsk_eY',
    description: 'Experience the raw beauty of Ladakh with this high-altitude trek through stunning mountain passes and ancient monasteries.',
    price: '₹15,500',
  },
  {
    id: 'nilgiri-hills-walk',
    name: 'Nilgiri Hills Walk',
    region: 'Nilgiri Hills',
    difficulty: 'Easy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNZhH34KFnMZQ7wugn8aWB2FqNv8nXIuGu1Biihi6Atc8kfn6IXU-FIM3kFo4NPs4gPZZ_5U6mNWfNS9v5oPmuig-pjAJLVtFaIgKcrpoYoHwxgkVz2faJ1c2Xg5rMlqOMTxrrZF7oCYMGJfrwpzCCutF1mTCTMRnFMQQ4BpxoqWKcfJS59GVx690HTeOHtBiZDd59fffFhRIQuQcqhRUlzBnbdCaZLzFtQD01-2HslTnqnu8u9I9sTKACI3od3WpHgYqPc32Ttnt',
    description: 'A gentle walk through the picturesque Nilgiri Hills, featuring tea gardens, waterfalls, and colonial architecture.',
    price: '₹6,500',
  },
  {
    id: 'spiti-valley-adventure',
    name: 'Spiti Valley Adventure',
    region: 'Spiti Valley',
    difficulty: 'Moderate',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk6ByCSSSxo1CAyxMtkHNNQ5-udfS9umEnwjreSd_ZpjVtuHyTUXLrjLflfz9MEvA7R4oMgPK4hCoAnesilx-YMvFscST5c7iHjmNxRjoJOPjqj8YFY6vTVLLafgOt4bD_T1IVLhOq7PVXQk_WPFwEU4Yj6o6--a7ed0gFRvJPOfJ3Z-sSEURhcTsAHUNyyWfQC86XC-QHGhklm28JzUM0TQRxCj_GSkWlX2-yY6l0KYfNHgBLFRQgvFsagMJJt95_JCMRmmJPXE9',
    description: 'Explore the mystical Spiti Valley with its dramatic landscapes, ancient monasteries, and unique culture.',
    price: '₹11,800',
  }
];
