import { BlobWithPreview, LocalImage } from "types";

export default function getBlobsFromLocalImages(
  images: LocalImage[]
): BlobWithPreview[] {
  // @ts-expect-error
  return images.filter((img) => Boolean(img.preview)) as BlobWithPreview[];
}
