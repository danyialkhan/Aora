import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
} from "react-native-appwrite";
import { UserType, VideosType } from "@/lib/customtypes";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.aora.app",
  projectId: "6772ab3f002510596cc8",
  databaseId: "6772ad2b001fc0e587a7",
  userCollectionId: "6772ad41003a52da38de",
  videoCollectionId: "6772ad800025b65914df",
  storageId: "6772afcb00185023d6f7",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

/**
 * Decodes a document from the Appwrite database into a user object.
 *
 * @param doc - The document to decode, of type `Models.Document`.
 * @returns A user object of type `UserType` containing the decoded information.
 */
export const decodeDocumentToUser = (doc: Models.Document): UserType => {
  return {
    accountId: doc.accountId,
    avatar: doc.avatar,
    email: doc.email,
    userName: doc.username,
  };
};

/**
 * Decodes a document into a video object.
 *
 * @param {Models.Document} doc - The document to decode.
 * @returns {VideosType} The decoded video object.
 */
export const decodeDocumentToVideo = (doc: Models.Document): VideosType => {
  return {
    title: doc.title,
    thumbnail: doc.thumbnail,
    prompt: doc.prompt,
    video: doc.video,
    id: doc.$id,
    user: {
      accountId: doc.users.accountId,
      avatar: doc.users.avatar,
      email: doc.users.email,
      userName: doc.users.username,
    },
  };
};

/**
 * Creates a custom error from an unknown error type.
 *
 * @param {unknown} error - The error to be converted.
 * @returns {Error} - The custom error.
 * @throws {Error} - Throws the custom error.
 */
const createCustomError = (error: unknown): Error => {
  throw createCustomError(error);
};

/**
 * Creates a new user account.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @param {string} userName - The username for the new user.
 * @returns {Promise<UserType>} - A promise that resolves to the newly created user.
 * @throws {Error} - Throws an error if user creation fails.
 */
export const createUser = async (
  email: string,
  password: string,
  userName: string
): Promise<UserType> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      userName
    );
    if (!newAccount) throw new Error("Error creating the new user.");
    const avatarUrl = avatars.getInitials();
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: userName,
        avatar: avatarUrl,
      }
    );
    return decodeDocumentToUser(newUser);
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};

/**
 * Signs in a user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is signed in.
 * @throws {Error} - Throws an error if sign-in fails.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<UserType>} - A promise that resolves to the currently authenticated user.
 * @throws {Error} - Throws an error if retrieving the current user fails.
 */
export const getCurrentUser = async (): Promise<UserType> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("Error while getting current user");

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("Error while getting current user");
    const userData = currentUser.documents[0];

    return decodeDocumentToUser(userData);
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};

/**
 * Fetches all video documents from the database and decodes them into an array of `VideosType` objects.
 *
 * @returns {Promise<VideosType[]>} A promise that resolves to an array of video objects.
 *
 * @throws Will throw an error if the request to fetch documents fails.
 *
 * @example
 * ```typescript
 * getAllVideos()
 *   .then(videos => {
 *     console.log(videos);
 *   })
 *   .catch(error => {
 *     console.error('Error fetching videos:', error);
 *   });
 * ```
 */
export const getAllVideos = async (): Promise<VideosType[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    const videos: VideosType[] = posts.documents.map((doc) =>
      decodeDocumentToVideo(doc)
    );

    return videos;
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};

/**
 * Fetches the latest posts from the database.
 *
 * This function retrieves the latest posts from the specified video collection,
 * orders them by creation date in descending order, and limits the results to 7 posts.
 * It then decodes each document into a `CustomModels.Video` object.
 *
 * @returns {Promise<VideosType[]>} A promise that resolves to an array of video objects.
 *
 * @throws Will throw an error if the database query fails.
 *
 * @example
 * ```typescript
 * getLatestPosts()
 *   .then((videos) => {
 *     console.log(videos);
 *   })
 *   .catch((error) => {
 *     console.error("Failed to fetch latest posts:", error);
 *   });
 * ```
 */
export const getLatestPosts = async (): Promise<VideosType[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    const videos: VideosType[] = posts.documents.map((doc) =>
      decodeDocumentToVideo(doc)
    );

    return videos;
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};

/**
 * Searches for posts based on the provided query string.
 *
 * @param {string} query - The search query to filter posts by title.
 * @returns {Promise<VideosType[]>} A promise that resolves to an array of videos matching the search query.
 *
 * @example
 * ```typescript
 * const query = "example search";
 * searchPosts(query).then((videos) => {
 *   console.log(videos);
 * }).catch((error) => {
 *   console.error(error);
 * });
 * ```
 *
 * @throws Will throw an error if the search operation fails.
 */
export const searchPosts = async (query: string): Promise<VideosType[]> => {
  try {
    console.log("searching for: ", query);
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.search("title", query),
    ]);

    console.log("Searched results: ", posts);
    const videos: VideosType[] = posts.documents.map((doc) =>
      decodeDocumentToVideo(doc)
    );

    return videos;
  } catch (error) {
    console.error(error);
    throw createCustomError(error);
  }
};
