export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoLink: string;
  imgURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTutorial {
  title: string;
  description: string;
  videoLink?: string;
  imgURL: string;
}
