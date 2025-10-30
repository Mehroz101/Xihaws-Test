import express from "express";
import { generateDescription } from "../utils/generateDescription";
import { jwtAuth } from "../middleware/jwtAuth";

const router = express.Router();

/**
 * @swagger
 * /api/ai/generate-description:
 *   post:
 *     summary: Generate AI description for a website
 *     description: Uses Google Gemini AI to generate a short, engaging description (2-3 sentences) for a website based on its title and category
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIDescriptionRequest'
 *     responses:
 *       200:
 *         description: Description generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIDescriptionResponse'
 *       400:
 *         description: Bad request - title and category are required
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
 *         description: Internal server error - AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/generate-description", jwtAuth(["admin"]), async (req, res) => {
  try {
    const { title, category, link } = req.body;

    if (!title || !category || !link) {
      return res.status(400).json({
        message: "Title, category, and link are required"
      });
    }

    const description = await generateDescription(title, category, link);

    res.json({
      success: true,
      description
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate description",
      error: error instanceof Error ? error.message : error
    });
  }
});

export default router;
