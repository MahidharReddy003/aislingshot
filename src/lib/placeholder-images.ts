
import data from '@/app/lib/placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

/**
 * Utility to get an image URL by ID or a fallback if not found.
 * This allows manual control of images via the placeholder-images.json file.
 */
export function getPlaceholderImageUrl(idOrHint: string): string {
  if (!idOrHint) return PlaceHolderImages.find(img => img.id === 'fallback-image')?.imageUrl || PlaceHolderImages[0].imageUrl;

  const image = PlaceHolderImages.find(img => 
    img.id === idOrHint || 
    img.imageHint.toLowerCase().includes(idOrHint.toLowerCase())
  );
  
  // Return the found image URL or a specific fallback if absolutely nothing matches
  return image?.imageUrl || PlaceHolderImages.find(img => img.id === 'fallback-image')?.imageUrl || PlaceHolderImages[0].imageUrl;
}
