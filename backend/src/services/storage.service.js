import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(file, folderPath) {
  try {
    const result = await client.files.upload({
      file: file,
      fileName: file.name,
      folder: "/posts",
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteFile(fileId) {
  try {
    const result = await client.files.delete(fileId);
    return result;
  } catch (error) {
    throw error;
  }
}

export default client;
