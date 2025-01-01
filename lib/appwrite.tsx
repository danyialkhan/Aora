import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
} from "react-native-appwrite";
import { CustomModels } from "@/lib/customtypes";

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

// Decoding function
export const decodeDocumentToUser = (
  doc: Models.Document
): CustomModels.User => {
  return {
    accountId: doc.id,
    userName: doc.name,
    email: doc.emailAddress,
    avatar: doc.avatarUrl,
  };
};

export const decodeDocumentToVideo = (
  doc: Models.Document
): CustomModels.Video<CustomModels.User> => {
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

export const createUser = async (
  email: string,
  password: string,
  userName: string
): Promise<CustomModels.User> => {
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
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};

export const getCurrentUser = async (): Promise<CustomModels.User> => {
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
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};

export const getAllVideos = async (): Promise<
  CustomModels.Video<CustomModels.User>[]
> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    const videos: CustomModels.Video<CustomModels.User>[] = posts.documents.map(
      (doc) => decodeDocumentToVideo(doc)
    );

    return videos;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};

export const getLatestPosts = async (): Promise<
  CustomModels.Video<CustomModels.User>[]
> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    const videos: CustomModels.Video<CustomModels.User>[] = posts.documents.map(
      (doc) => decodeDocumentToVideo(doc)
    );

    return videos;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};
