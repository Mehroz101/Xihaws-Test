import { Request, Response } from "express";
import { createSite, getAllSites, getSiteById, updateSite, deleteSite } from "../models/site";
import { generateDescription } from "../utils/generateDescription";
import { CloudinaryService } from "../services/cloudinaryService";

export const createSiteLink = async (req: Request, res: Response) => {
  try {
    const { title, siteUrl, coverImage, category } = req.body;
    const description = await generateDescription(title, category);
    const site = await createSite({ title, siteUrl, coverImage, category, description });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: "Failed to create site link", error });
  }
};

export const getSites = async (_: Request, res: Response) => {
  try {
    const sites = await getAllSites();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error });
  }
};

export const getSite = async (req: Request, res: Response) => {
  try {
    const site = await getSiteById(Number(req.params.id));
    if (!site) return res.status(404).json({ message: "Site not found" });
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: "Error fetching site", error });
  }
};

export const updateSiteLink = async (req: Request, res: Response) => {
  try {
    const site = await updateSite(Number(req.params.id), req.body);
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: "Failed to update site", error });
  }
};

export const deleteSiteLink = async (req: Request, res: Response) => {
  try {
    // Get the site first to check if it has a cover image
    const site = await getSiteById(Number(req.params.id));
    if (site && site.coverImage) {
      // Extract public ID from Cloudinary URL and delete the image
      const publicId = CloudinaryService.extractPublicId(site.coverImage);
      if (publicId) {
        await CloudinaryService.deleteImage(publicId);
      }
    }
    
    await deleteSite(Number(req.params.id));
    res.json({ message: "Site deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete site", error });
  }
};

// Upload image and return Cloudinary URL
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploadResult = await CloudinaryService.uploadImage(req.file.buffer);
    
    res.json({
      message: "Image uploaded successfully",
      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to upload image", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

// Create site with image upload
export const createSiteWithImage = async (req: Request, res: Response) => {
  try {
    const { title, siteUrl, category } = req.body;
    let coverImage = req.body.coverImage; // For URL-based images
    
    // If file was uploaded, use Cloudinary
    if (req.file) {
      const uploadResult = await CloudinaryService.uploadImage(req.file.buffer);
      coverImage = uploadResult.secure_url;
    }
    
    const description = await generateDescription(title, category);
    const site = await createSite({ title, siteUrl, coverImage, category, description });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create site link", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

// Update site with image upload
export const updateSiteWithImage = async (req: Request, res: Response) => {
  try {
    const siteId = Number(req.params.id);
    const { title, siteUrl, category } = req.body;
    let coverImage = req.body.coverImage; // For URL-based images
    
    // Get existing site to check for old image
    const existingSite = await getSiteById(siteId);
    
    // If file was uploaded, use Cloudinary
    if (req.file) {
      const uploadResult = await CloudinaryService.uploadImage(req.file.buffer);
      coverImage = uploadResult.secure_url;
      
      // Delete old image if it exists and is from Cloudinary
      if (existingSite && existingSite.coverImage) {
        const publicId = CloudinaryService.extractPublicId(existingSite.coverImage);
        if (publicId) {
          await CloudinaryService.deleteImage(publicId);
        }
      }
    }
    
    const site = await updateSite(siteId, { title, siteUrl, coverImage, category });
    res.json(site);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update site", 
      error: error instanceof Error ? error.message : error 
    });
  }
};
