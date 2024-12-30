import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
import { User } from "@/lib/customtypes";

export const appWriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.aora.app",
  projectId: "6772ab3f002510596cc8",
  databaseId: "6772ad2b001fc0e587a7",
  userCollectionId: "6772ad41003a52da38de",
  videoCollectionId: "6772ad800025b65914df",
  storageId: "6772afcb00185023d6f7",
};

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

client
  .setEndpoint(appWriteConfig.endpoint)
  .setProject(appWriteConfig.projectId)
  .setPlatform(appWriteConfig.platform);

export const createUser = async (
  email: string,
  password: string,
  userName: string
): Promise<User> => {
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
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: userName,
        avatar: avatarUrl,
      }
    );
    return {
      accountId: newUser.accountId,
      avatar: newUser.avatar,
      email: newUser.email,
      userName: newUser.username,
    };
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

export const getCurrentUser = async (): Promise<User> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("Error while getting current user");

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("Error while getting current user");
    const userData = currentUser.documents[0];

    return {
      accountId: userData.accountId,
      avatar: userData.avatar,
      email: userData.email,
      userName: userData.username,
    };
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message.replace("AppwriteException:", ""));
  }
};
