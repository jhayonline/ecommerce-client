import { backendRequest, getImageUrl } from './client';
import { API_BASE_URL } from './config';
import type { ProductImage } from './types';

export type { ProductImage } from './types';

export const imagesApi = {
  async getImages(productPid: string): Promise<{ success: boolean; data: ProductImage[]; message: string }> {
    const response = await backendRequest<ProductImage[]>(`/products/${productPid}/images`);
    // Transform image URLs to full URLs
    const imagesWithFullUrls = response.data.map(img => ({
      ...img,
      image_url: getImageUrl(img.image_url)
    }));
    return {
      success: true,
      data: imagesWithFullUrls,
      message: 'Success'
    };
  },

  // Also update the upload response
  async upload(productPid: string, file: File): Promise<{ success: boolean; data: ProductImage; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('access_token');
    const url = `${API_BASE_URL}/products/${productPid}/images`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.description || 'Upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        ...data,
        image_url: getImageUrl(data.image_url)
      },
      message: 'Image uploaded'
    };
  },

  async setPrimary(productPid: string, imageId: string): Promise<{ success: boolean; data: null; message: string }> {
    await backendRequest<unknown>(`/products/${productPid}/images/${imageId}/primary`, {
      method: 'PUT',
    });
    return {
      success: true,
      data: null,
      message: 'Primary image set'
    };
  },

  async deleteImage(productPid: string, imageId: string): Promise<{ success: boolean; data: null; message: string }> {
    await backendRequest<unknown>(`/products/${productPid}/images/${imageId}`, {
      method: 'DELETE',
    });
    return {
      success: true,
      data: null,
      message: 'Image deleted'
    };
  },
};
