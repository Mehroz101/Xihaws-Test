import { Request, Response } from "express";
import {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
} from "../models/site";
import { CloudinaryService } from "../services/cloudinaryService";

export const createSiteLink = async (req: Request, res: Response) => {
  try {
    let { title, site_url, coverImage, category, description } = req.body as {
      title: string;
      site_url: string;
      coverImage?: string;
      category: string;
      description?: string;
    };

    // If client sent a data URI / base64 image, upload it to Cloudinary first
    if (typeof coverImage === "string" && coverImage.startsWith("data:")) {
      try {
        const uploadResult = await CloudinaryService.uploadImage(coverImage);
        coverImage = uploadResult.secure_url;
      } catch (err) {
        console.error("Image upload failed in createSiteLink:", err);
        return res
          .status(400)
          .json({
            message: "Invalid coverImage or upload failed",
            error: err instanceof Error ? err.message : err,
          });
      }
    }

    // Basic defensive length checks to avoid DB varchar overflow
    if (typeof title === "string" && title.length > 200)
      title = title.slice(0, 200);
    if (typeof category === "string" && category.length > 50)
      category = category.slice(0, 50);
    if (typeof site_url === "string" && site_url.length > 500)
      site_url = site_url.slice(0, 500);

    // If coverImage is still a very long string (not a URL), reject and ask client to upload via multipart or send a URL
    if (typeof coverImage === "string" && coverImage.length > 500) {
      return res
        .status(400)
        .json({
          message:
            "coverImage too long. Please upload the image via the upload endpoint or send an externally-hosted URL.",
        });
    }

    // Description must be provided by the client API
    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ message: "description is required in the request body" });
    }

    // Ensure coverImage is a string (DB schema allows NULL but our createSite signature expects string fields)
    coverImage = coverImage ?? "";

    const site = await createSite({
      title,
      site_url,
      coverImage,
      category,
      description,
    });
    res.status(201).json(site);
  } catch (error) {
    console.log(error);
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
    const uploadResult = await CloudinaryService.uploadImage(
      req.body.cover_image
    );
    const coverImage = uploadResult.secure_url;

    const site = await updateSite(Number(req.params.id), {
      coverImage: coverImage,
      ...req.body,
    });

    res.json(site);
  } catch (error) {
    console.log(error)
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




