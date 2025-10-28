import express from "express";
import { 
  createSiteLink, 
  getSites, 
  getSite, 
  updateSiteLink, 
  deleteSiteLink,
  uploadImage,
  createSiteWithImage,
  updateSiteWithImage
} from "../controllers/siteController";
import { jwtAuth } from "../middleware/jwtAuth";
import { uploadSingleImage, handleUploadError } from "../middleware/uploadMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/sites:
 *   get:
 *     summary: Get all website links
 *     tags: [Sites]
 *     responses:
 *       200:
 *         description: List of all sites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Site'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getSites);

/**
 * @swagger
 * /api/sites/{id}:
 *   get:
 *     summary: Get a specific website link by ID
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       404:
 *         description: Site not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getSite);

/**
 * @swagger
 * /api/sites/upload-image:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       400:
 *         description: Bad request - no image provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/upload-image", jwtAuth(["admin"]), uploadSingleImage, handleUploadError, uploadImage);

/**
 * @swagger
 * /api/sites:
 *   post:
 *     summary: Create a new website link (Admin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - siteUrl
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Website title
 *                 example: "Google Search"
 *               siteUrl:
 *                 type: string
 *                 format: uri
 *                 description: Website URL
 *                 example: "https://google.com"
 *               category:
 *                 type: string
 *                 description: Website category
 *                 example: "Technology"
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 description: Cover image URL (optional)
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Site created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", jwtAuth(["admin"]), createSiteLink);

/**
 * @swagger
 * /api/sites/with-image:
 *   post:
 *     summary: Create a new website link with image upload (Admin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - siteUrl
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Website title
 *                 example: "Google Search"
 *               siteUrl:
 *                 type: string
 *                 format: uri
 *                 description: Website URL
 *                 example: "https://google.com"
 *               category:
 *                 type: string
 *                 description: Website category
 *                 example: "Technology"
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 description: Cover image URL (optional)
 *                 example: "https://example.com/image.jpg"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (optional)
 *     responses:
 *       201:
 *         description: Site created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/with-image", jwtAuth(["admin"]), uploadSingleImage, handleUploadError, createSiteWithImage);

/**
 * @swagger
 * /api/sites/{id}:
 *   put:
 *     summary: Update a website link (Admin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Website title
 *               siteUrl:
 *                 type: string
 *                 format: uri
 *                 description: Website URL
 *               category:
 *                 type: string
 *                 description: Website category
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 description: Cover image URL
 *     responses:
 *       200:
 *         description: Site updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Site not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", jwtAuth(["admin"]), updateSiteLink);

/**
 * @swagger
 * /api/sites/{id}/with-image:
 *   put:
 *     summary: Update a website link with image upload (Admin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Website title
 *               siteUrl:
 *                 type: string
 *                 format: uri
 *                 description: Website URL
 *               category:
 *                 type: string
 *                 description: Website category
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 description: Cover image URL
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (optional)
 *     responses:
 *       200:
 *         description: Site updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Site not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id/with-image", jwtAuth(["admin"]), uploadSingleImage, handleUploadError, updateSiteWithImage);

/**
 * @swagger
 * /api/sites/{id}:
 *   delete:
 *     summary: Delete a website link (Admin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Site deleted"
 *       401:
 *         description: Unauthorized - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Site not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", jwtAuth(["admin"]), deleteSiteLink);

export default router;
