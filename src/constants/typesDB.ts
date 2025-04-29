export interface Recipe {
  _id: string;
  title: string;
  imageUrl?: string;
  instructions?: string;
  ingredients?: string[];
  cookingTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  userOwner?: {
    _id: string;
    username: string;
    email?: string;
  };
  isGenerated?: boolean;
  createdAt?: string;
}

export type UserData = {
  _id: string;
  username: string;
  email: string;
  about: string;
  specialties: string[];
  recipes: Recipe[];
  profileImageUrl: string | null;
};
