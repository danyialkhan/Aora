/**
 * Namespace containing custom models.
 */
export declare namespace CustomModels {
  /**
   * Represents a user with account details.
   *
   * @property accountId - The unique identifier for the user's account.
   * @property userName - The name of the user.
   * @property email - The email address of the user.
   * @property avatar - The URL to the user's avatar image.
   */
  type User = {
    id: string;
    accountId: string;
    userName: string;
    email: string;
    avatar: string;
  };

  /**
   * Represents a video object with associated user information.
   *
   * @template User - A type that extends CustomModels.User.
   *
   * @property {string} title - The title of the video.
   * @property {string} thumbnail - The URL of the video's thumbnail image.
   * @property {string} prompt - A prompt or description for the video.
   * @property {string} video - The URL of the video file.
   * @property {string} id - A unique identifier for the video.
   * @property {User} user - The user associated with the video.
   */
  type Video<User extends CustomModels.User> = {
    title: string;
    thumbnail: string;
    prompt: string;
    video: string;
    id: string;
    user: User;
  };
}

// Define a type alias for CustomModels.Video<CustomModels.User>
export type VideosType = CustomModels.Video<CustomModels.User>;
export type UserType = CustomModels.User;
