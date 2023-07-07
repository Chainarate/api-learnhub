export interface ICreateUser {
  username: string;
  name: string;
  password: string;
  registeredAt: Date;
}

interface UserDto {
  id: string
  username: string
  name: string
  registeredAt: string
}

export interface IUser extends ICreateUser {
  id: string;
}

export interface ICreateContent {
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  //postedBy: UserDto
}

export interface IContent extends ICreateContent {
  id: number;
}
