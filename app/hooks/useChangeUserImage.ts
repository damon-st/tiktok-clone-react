import { storage } from "@/libs/AppWriteClient";

import Image from "image-js";

const userChangeUserImage = async (
  file: File,
  cropper: any,
  currentImage: string
) => {
  let vieoId = Math.random().toString(36).slice(2, 22);

  const x = cropper.left;
  const y = cropper.top;
  const width = cropper.width;
  const height = cropper.height;
  try {
    const response = await fetch(URL.createObjectURL(file));
    const imageBuffer = await response.arrayBuffer();

    const image = await Image.load(imageBuffer);
    const croppedImage = image.crop({ x, y, width, height });
    const resizedImage = croppedImage.resize({ width: 200, height: 200 });
    const blob = await resizedImage.toBlob();
    const arryarBuffer = await blob.arrayBuffer();
    const finalFile = new File([arryarBuffer], file.name, { type: blob.type });
    const bukedId = process.env.NEXT_PUBLIC_BUCKED_ID!;
    const result = await storage.createFile(bukedId, vieoId, finalFile);
    if (
      currentImage !=
      String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID)
    ) {
      await storage.deleteFile(bukedId, currentImage);
    }
    return result.$id;
  } catch (error) {
    throw error;
  }
};

export default userChangeUserImage;
