export interface FeedAuthor {
  name: string;
  specialty: string;
  avatar: string;
  verified: boolean;
}

// export interface DoctorFeedPost {
//   id: number;
//   author: FeedAuthor;
//   time: string;
//   category: string;
//   categoryColor: string;
//   content: string;
//   tags: string[];
//   likes: number;
//   comments: number;
//   liked: boolean;
//   bookmarked: boolean;
//   image?: string;
//   imageHeight?: number;
//   accentColor?: string;
// }

export interface FeedPost {
  id: number;
  author: {
    name: string;
    specialty: string;
    avatar: string;
    verified: boolean;
  };
  time: string;
  category: string;
  categoryColor: string;
  content: string;
  image?: string;
  imageHeight?: number;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: string;
  liked: boolean;
  bookmarked: boolean;
  accentColor: string;
}

export interface TrendingTopic {
  tag: string;
  count: number;
}

export interface SuggestedDoctor {
  name: string;
  specialty: string;
  avatar: string;
}
