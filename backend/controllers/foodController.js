import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from 'path';

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch food items" });
    }
};

// add food
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const { name, description, price, category } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: "Name, price, and category are required" });
        }

        const food = new foodModel({
            name: name.trim(),
            description: (description || "").trim(),
            price: Number(price),
            category,
            image: req.file.filename,
        });

        await food.save();
        res.json({ success: true, message: "Food item added successfully!", data: food });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({ success: false, message: "Failed to add food item" });
    }
};

// update / edit food
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Food ID is required" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        const updateData = {
            name: name ? name.trim() : food.name,
            description: description !== undefined ? description.trim() : food.description,
            price: price ? Number(price) : food.price,
            category: category || food.category,
        };

        // If a new image was uploaded
        if (req.file) {
            if (food.image) {
                const oldPath = path.join('uploads', food.image);
                if (fs.existsSync(oldPath)) {
                    try {
                        fs.unlinkSync(oldPath);
                    } catch (e) {
                        console.warn("Could not delete old image:", e.message);
                    }
                }
            }
            updateData.image = req.file.filename;
        }

        const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "Food item updated successfully!", data: updatedFood });
    } catch (error) {
        console.error("Update food error:", error);
        res.status(500).json({ success: false, message: "Failed to update food item" });
    }
};

// delete food
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        const filePath = path.join('uploads', food.image);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkErr) {
                console.warn("Could not delete image file:", unlinkErr.message);
            }
        }

        await foodModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Food item removed successfully!" });
    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
};

export { listFood, addFood, updateFood, removeFood };
